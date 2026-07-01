import secrets
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, status
from fastapi.responses import RedirectResponse
from itsdangerous import BadSignature, URLSafeTimedSerializer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..config import get_settings
from ..cookies import set_session_cookie
from ..database import get_db
from ..models import User
from ..security import create_session

settings = get_settings()
router = APIRouter(prefix="/api/auth/google", tags=["auth", "google"])

GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo"

_STATE_COOKIE = "pw_oauth_state"
_serializer = URLSafeTimedSerializer(settings.secret_key, salt="google-oauth-state")


@router.get("/login")
async def google_login():
    if not settings.google_enabled:
        # Redirect back to the frontend with a friendly, non-fatal error flag.
        return RedirectResponse(
            f"{settings.frontend_origin}/login?error=google_unavailable",
            status_code=status.HTTP_302_FOUND,
        )

    state = _serializer.dumps(secrets.token_urlsafe(16))
    params = {
        "client_id": settings.google_client_id,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "select_account",
    }
    resp = RedirectResponse(
        f"{GOOGLE_AUTH_URL}?{urlencode(params)}", status_code=status.HTTP_302_FOUND
    )
    resp.set_cookie(
        _STATE_COOKIE, state, max_age=600, httponly=True,
        secure=settings.cookie_secure, samesite="lax", path="/",
    )
    return resp


@router.get("/callback")
async def google_callback(
    request: Request,
    code: str | None = None,
    state: str | None = None,
    error: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    if error or not code:
        return RedirectResponse(
            f"{settings.frontend_origin}/login?error=google_cancelled",
            status_code=status.HTTP_302_FOUND,
        )

    # CSRF: state in query must match the signed state cookie we issued.
    cookie_state = request.cookies.get(_STATE_COOKIE)
    if not state or state != cookie_state:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")
    try:
        _serializer.loads(state, max_age=600)
    except BadSignature:
        raise HTTPException(status_code=400, detail="Invalid OAuth state")

    async with httpx.AsyncClient(timeout=15) as client:
        token_resp = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.google_client_id,
                "client_secret": settings.google_client_secret,
                "redirect_uri": settings.google_redirect_uri,
                "grant_type": "authorization_code",
            },
        )
        if token_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to exchange Google code")
        access_token = token_resp.json().get("access_token")

        userinfo_resp = await client.get(
            GOOGLE_USERINFO_URL, headers={"Authorization": f"Bearer {access_token}"}
        )
        if userinfo_resp.status_code != 200:
            raise HTTPException(status_code=400, detail="Failed to fetch Google profile")
        info = userinfo_resp.json()

    google_sub = info.get("sub")
    email = (info.get("email") or "").lower().strip()
    if not google_sub or not email:
        raise HTTPException(status_code=400, detail="Google account missing email")

    # Upsert: match on google_sub first, then fall back to email so an existing
    # password account gets linked instead of duplicated.
    result = await db.execute(select(User).where(User.google_sub == google_sub))
    user = result.scalar_one_or_none()
    if user is None:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

    if user is None:
        user = User(
            email=email,
            full_name=info.get("name"),
            google_sub=google_sub,
            avatar_url=info.get("picture"),
        )
        db.add(user)
    else:
        if not user.google_sub:
            user.google_sub = google_sub
        if not user.avatar_url and info.get("picture"):
            user.avatar_url = info.get("picture")
        if not user.full_name and info.get("name"):
            user.full_name = info.get("name")
    await db.commit()
    await db.refresh(user)

    session = await create_session(db, user)
    resp = RedirectResponse(
        settings.frontend_post_login_url, status_code=status.HTTP_302_FOUND
    )
    set_session_cookie(resp, session.token)
    resp.delete_cookie(_STATE_COOKIE, path="/")
    return resp
