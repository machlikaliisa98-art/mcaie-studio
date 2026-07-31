from fastapi import APIRouter

from app.services.playback import playback

router = APIRouter(

    prefix="/playback",

    tags=["Playback"],

)


@router.get("/")

def continue_listening():

    return playback.continue_listening()


@router.get("/{episode}")

def playback_state(

    episode: str,

):

    return playback.get(episode)


@router.post("/")

def update_playback(

    project_id: str,

    episode: str,

    position: float,

    duration: float,

):

    playback.update(

        project_id,

        episode,

        position,

        duration,

    )

    return {

        "status": "updated",

    }