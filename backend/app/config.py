from functools import lru_cache

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql+asyncpg://postwing:postwing@localhost:5432/postwing"

    @field_validator("database_url", mode="before")
    @classmethod
    def _normalize_async_driver(cls, v: str) -> str:
        # Railway/Heroku hand out `postgres://` or `postgresql://`; SQLAlchemy's async
        # engine needs the asyncpg driver. Rewrite the scheme so a plain platform URL works.
        if isinstance(v, str):
            if v.startswith("postgres://"):
                v = "postgresql+asyncpg://" + v[len("postgres://"):]
            elif v.startswith("postgresql://"):
                v = "postgresql+asyncpg://" + v[len("postgresql://"):]
        return v

    # Security / sessions
    secret_key: str = "dev-insecure-secret-change-me"
    session_cookie_name: str = "pw_session"
    session_ttl_hours: int = 720
    cookie_secure: bool = False
    cookie_samesite: str = "lax"
    cookie_domain: str | None = None

    # Frontend
    frontend_origin: str = "http://localhost:3000"
    frontend_post_login_url: str = "http://localhost:3000/coming-soon"

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""
    google_redirect_uri: str = "http://localhost:8000/api/auth/google/callback"

    @property
    def google_enabled(self) -> bool:
        return bool(self.google_client_id and self.google_client_secret)

    @property
    def cookie_domain_value(self) -> str | None:
        # Treat empty string as "host-only" (None)
        return self.cookie_domain or None


@lru_cache
def get_settings() -> Settings:
    return Settings()
