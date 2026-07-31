from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.upload import router as upload_router
from app.api.episodes import router as episodes_router
from app.api.jobs import router as jobs_router
from app.api.library import router as library_router
from app.api.projects import router as projects_router
from app.api.analytics import router as analytics_router
from app.api.dashboard import router as dashboard_router
from app.api.playback import router as playback_router
from app.api.search import router as search_router
from app.api.studio import router as studio_router
from app.api.websocket import router as websocket_router
from app.api.sessions import router as sessions_router

app = FastAPI(
    title="Man Cave UG AI Studio",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to your frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#
# API Routes
#

app.include_router(upload_router)
app.include_router(episodes_router)
app.include_router(jobs_router)
app.include_router(library_router)
app.include_router(projects_router)
app.include_router(analytics_router)
app.include_router(dashboard_router)
app.include_router(playback_router)
app.include_router(search_router)
app.include_router(studio_router)
app.include_router(websocket_router)
app.include_router(sessions_router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "application": "Man Cave UG AI Studio",
        "engine": "MCAIE",
        "version": "2.0.0",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }