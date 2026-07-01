from fastapi import Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from sqlalchemy import select

from .config import get_settings
from .database import get_db
from .models import Session, User

settings = get_settings()


async def get_current_user(
    request: Request, db: AsyncSession = Depends(get_db)
) -> User | None:
    token = request.cookies.get(settings.session_cookie_name)
    if not token:
        return None

    result = await db.execute(
        select(Session).where(Session.token == token).options(selectinload(Session.user))
    )
    session = result.scalar_one_or_none()
    if session is None:
        return None
    if session.is_expired:
        await db.delete(session)
        await db.commit()
        return None
    return session.user
