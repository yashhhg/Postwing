import secrets
from datetime import datetime, timedelta, timezone

from passlib.context import CryptContext
from sqlalchemy import delete
from sqlalchemy.ext.asyncio import AsyncSession

from .config import get_settings
from .models import Session, User

settings = get_settings()

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str | None) -> bool:
    if not password_hash:
        return False
    return pwd_context.verify(password, password_hash)


async def create_session(db: AsyncSession, user: User) -> Session:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=settings.session_ttl_hours)
    session = Session(token=token, user_id=user.id, expires_at=expires_at)
    db.add(session)
    await db.commit()
    return session


async def delete_session(db: AsyncSession, token: str) -> None:
    await db.execute(delete(Session).where(Session.token == token))
    await db.commit()
