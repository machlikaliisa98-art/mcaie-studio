from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import OUTPUTS

router = APIRouter(

    prefix="/audio",

    tags=["Audio"],

)

SHOWS = OUTPUTS / "shows"


@router.get("/{show}/{episode}")

def stream_audio(

    show: str,

    episode: str,

):

    folder = SHOWS / show

    if not folder.exists():

        raise HTTPException(

            status_code=404,

            detail="Show not found.",

        )

    audio = folder / f"{episode}.wav"

    if not audio.exists():

        raise HTTPException(

            status_code=404,

            detail="Audio not found.",

        )

    return FileResponse(

        audio,

        media_type="audio/wav",

        filename=audio.name,

    )