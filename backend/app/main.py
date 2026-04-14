from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import init_db_if_enabled
from app.routers import attendee, auth, coordination, crowd, queue, users, websocket


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db_if_enabled()
    yield


app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(crowd.router, prefix="/crowd", tags=["crowd"])
app.include_router(queue.router, prefix="/queue", tags=["queue"])
app.include_router(coordination.router, prefix="/coordination", tags=["coordination"])
app.include_router(attendee.router, prefix="/attendee", tags=["attendee"])
app.include_router(websocket.router, tags=["websocket"])


@app.get("/health", summary="Health check")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}
