from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .database import init_models
from .routers import auth, google

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_models()
    yield


app = FastAPI(title="Postwing API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(google.router)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/config")
async def public_config():
    """Frontend reads this to decide whether to enable the Google buttons."""
    return {"google_enabled": settings.google_enabled}
