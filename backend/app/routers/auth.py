from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from ..cookies import clear_session_cookie, set_session_cookie
from ..database import get_db
from ..deps import get_current_user
from ..models import User
from ..schemas import AuthResponse, LoginIn, RegisterIn, UserOut
from ..security import create_session, hash_password, verify_password

router = APIRouter(prefix="/api/auth", tags=["auth"])


async def _get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()


@router.post("/register", response_model=AuthResponse)
async def register(payload: RegisterIn, response: Response, db: AsyncSession = Depends(get_db)):
    email = payload.email.lower().strip()
    existing = await _get_user_by_email(db, email)

    if existing is not None:
        # Requirement: an already-registered email should NOT be rejected — log the
        # user in instead. We still verify the password so an existing account can't
        # be hijacked by someone re-registering the same email.
        if not verify_password(payload.password, existing.password_hash):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This email is already registered. Please log in with your password.",
            )
        session = await create_session(db, existing)
        set_session_cookie(response, session.token)
        return AuthResponse(user=UserOut.model_validate(existing), existing_account=True)

    user = User(
        email=email,
        full_name=payload.full_name.strip(),
        password_hash=hash_password(payload.password),
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    session = await create_session(db, user)
    set_session_cookie(response, session.token)
    return AuthResponse(user=UserOut.model_validate(user), existing_account=False)


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginIn, response: Response, db: AsyncSession = Depends(get_db)):
    email = payload.email.lower().strip()
    user = await _get_user_by_email(db, email)
    if user is None or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    session = await create_session(db, user)
    set_session_cookie(response, session.token)
    return AuthResponse(user=UserOut.model_validate(user), existing_account=True)


@router.get("/me", response_model=UserOut)
async def me(current_user: User | None = Depends(get_current_user)):
    if current_user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    return UserOut.model_validate(current_user)


@router.post("/logout")
async def logout(request: Request, response: Response, db: AsyncSession = Depends(get_db)):
    from ..config import get_settings
    from ..security import delete_session

    token = request.cookies.get(get_settings().session_cookie_name)
    if token:
        await delete_session(db, token)
    clear_session_cookie(response)
    return {"ok": True}
