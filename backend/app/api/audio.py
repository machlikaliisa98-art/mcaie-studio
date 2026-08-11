from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import OUTPUTS


router = APIRouter(
    prefix="/audio",
    tags=["Audio"],
)


SHOWS = OUTPUTS / "shows"


@router.get(
    "/{show}/{programme}/{season}/{filename}"
)
def stream_audio(
    show: str,
    programme: str,
    season: str,
    filename: str,
):

    # ==========================================================
    # BASIC PATH VALIDATION
    # ==========================================================

    if (
        "/" in show
        or "\\" in show
        or "/" in programme
        or "\\" in programme
        or "/" in season
        or "\\" in season
        or "/" in filename
        or "\\" in filename
    ):

        raise HTTPException(
            status_code=400,
            detail="Invalid audio path.",
        )

    # ==========================================================
    # SHOW
    # ==========================================================

    show_folder = (
        SHOWS /
        show
    )

    if not show_folder.exists():

        raise HTTPException(
            status_code=404,
            detail="Show not found.",
        )

    # ==========================================================
    # PROGRAMME
    # ==========================================================

    programme_folder = (
        show_folder /
        "programmes" /
        programme
    )

    if not programme_folder.exists():

        raise HTTPException(
            status_code=404,
            detail="Programme not found.",
        )

    # ==========================================================
    # SEASON
    # ==========================================================

    season_folder = (
        programme_folder /
        season
    )

    if not season_folder.exists():

        raise HTTPException(
            status_code=404,
            detail="Season not found.",
        )

    # ==========================================================
    # AUDIO
    # ==========================================================

    audio = (
        season_folder /
        filename
    )

    if (
        not audio.exists()
        or
        not audio.is_file()
    ):

        raise HTTPException(
            status_code=404,
            detail="Audio not found.",
        )

    # ==========================================================
    # SAFETY
    # ==========================================================

    try:

        audio.resolve().relative_to(
            season_folder.resolve()
        )

    except ValueError:

        raise HTTPException(
            status_code=400,
            detail="Invalid audio path.",
        )

    # ==========================================================
    # STREAM
    # ==========================================================

    return FileResponse(
        path=audio,
        media_type="audio/wav",
        filename=audio.name,
    )