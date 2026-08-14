from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.dependencies.auth import get_current_creator
from app.models.creator import Creator
from app.services.creator_analytics import creator_analytics


router = APIRouter(
    prefix="/creator-analytics",
    tags=["Creator Analytics"],
)


class StartSessionRequest(BaseModel):
    listener_id: str
    creator_id: str
    show_id: str
    episode_id: str
    duration: float = 0.0


class HeartbeatRequest(BaseModel):
    session_id: str
    position: float


class EventRequest(BaseModel):
    session_id: str
    event_type: str
    position: float = 0.0


# ==========================================================
# PUBLIC LISTENER ANALYTICS
# ==========================================================

@router.post("/session/start")
def start_session(
    request: StartSessionRequest,
):
    """
    Start a listener playback session.

    This endpoint is intentionally public because
    ordinary listeners do not need a creator account
    just to listen to an episode.
    """

    return creator_analytics.start_session(
        listener_id=request.listener_id,
        creator_id=request.creator_id,
        show_id=request.show_id,
        episode_id=request.episode_id,
        duration=request.duration,
    )


@router.post("/session/heartbeat")
def heartbeat(
    request: HeartbeatRequest,
):
    """
    Keep an active listener session alive
    and update the current playback position.
    """

    result = creator_analytics.heartbeat(
        session_id=request.session_id,
        position=request.position,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Listener session not found.",
        )

    return result


@router.post("/session/event")
def event(
    request: EventRequest,
):
    """
    Record playback events such as:

    play
    pause
    resume
    complete
    ended
    download
    """

    result = creator_analytics.event(
        session_id=request.session_id,
        event_type=request.event_type,
        position=request.position,
    )

    if result is None:
        raise HTTPException(
            status_code=404,
            detail="Listener session not found.",
        )

    return result


# ==========================================================
# AUTHENTICATED CREATOR ANALYTICS
# ==========================================================

@router.get("/me")
def creator_dashboard(
    creator: Creator = Depends(get_current_creator),
):
    """
    Return analytics for the authenticated creator.

    We use the creator username as the analytics
    identifier because listener sessions currently
    store the public creator identifier.
    """

    return creator_analytics.dashboard(
        creator.username
    )


@router.get("/me/live")
def creator_live(
    episode_id: str | None = None,
    creator: Creator = Depends(get_current_creator),
):
    """
    Return currently active listeners for the
    authenticated creator.
    """

    return creator_analytics.live_listeners(
        creator_id=creator.username,
        episode_id=episode_id,
    )