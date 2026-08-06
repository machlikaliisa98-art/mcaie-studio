from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.analytics import router as analytics_router
from app.api.audio import router as audio_router
from app.api.auth import router as auth_router
from app.api.dashboard import router as dashboard_router
from app.api.episodes import router as episodes_router
from app.api.jobs import router as jobs_router
from app.api.library import router as library_router
from app.api.playback import router as playback_router
from app.api.projects import router as projects_router
from app.api.search import router as search_router
from app.api.sessions import router as sessions_router
from app.api.shows import router as shows_router
from app.api.studio import router as studio_router
from app.api.upload import router as upload_router
from app.api.websocket import router as websocket_router

app = FastAPI(
    title="FONS API",
    description="FONS Conversation Intelligence & Publishing Platform powered by MCAIE",
    version="3.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# Authentication
# ==========================================================

app.include_router(auth_router)

# ==========================================================
# Upload & Production
# ==========================================================

app.include_router(upload_router)
app.include_router(studio_router)
app.include_router(jobs_router)

# ==========================================================
# Library, Shows & Playback
# ==========================================================

app.include_router(library_router)
app.include_router(episodes_router)
app.include_router(playback_router)
app.include_router(shows_router)
app.include_router(audio_router)

# ==========================================================
# Discovery
# ==========================================================

app.include_router(search_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)

# ==========================================================
# Creator Workspace
# ==========================================================

app.include_router(projects_router)

# ==========================================================
# Live Conversations
# ==========================================================

app.include_router(sessions_router)
app.include_router(websocket_router)


@app.get("/")
async def root():
    return {
        "application": "FONS",
        "engine": "MCAIE",
        "status": "running",
        "version": "3.0.0",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "application": "FONS",
        "engine": "MCAIE",
    }