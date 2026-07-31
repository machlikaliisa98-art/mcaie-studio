from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import PROCESSED


router = APIRouter(
    prefix="/episodes",
    tags=["Episodes"],
)


@router.get("/{job_id}")
def list_episodes(job_id: str):

    folder = PROCESSED / job_id

    if not folder.exists():

        return []

    episodes = []

    for file in sorted(folder.glob("*.wav")):

        episodes.append(file.name)

    return episodes


@router.get("/file/{filename}")
def get_episode(filename: str):

    for job in PROCESSED.iterdir():

        if not job.is_dir():

            continue

        audio = job / filename

        if audio.exists():

            return FileResponse(

                audio,

                media_type="audio/wav",

                filename=filename,

            )

    raise HTTPException(

        status_code=404,

        detail="Episode not found.",

    )