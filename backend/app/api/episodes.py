from pathlib import Path

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import PROCESSED


router = APIRouter(
    prefix="/episodes",
    tags=["Episodes"],
)


@router.get("/{job_id}")
def list_episodes(
    job_id: str,
):

    folder = (
        PROCESSED /
        job_id
    )

    if not folder.exists():
        return []

    files = sorted(
        folder.glob(
            "*.wav"
        )
    )

    episodes = []

    for index, file in enumerate(
        files,
        start=1,
    ):

        episodes.append(
            {
                "id": index,

                "episode_number": index,

                "title": (
                    f"Episode {index}"
                ),

                "filename": file.name,

                "job_id": job_id,
            }
        )

    return episodes


@router.get(
    "/file/{job_id}/{filename}"
)
def get_episode(
    job_id: str,
    filename: str,
):

    file = (
        PROCESSED /
        job_id /
        filename
    )

    if not file.exists():

        raise HTTPException(
            status_code=404,
            detail="Episode not found",
        )

    return FileResponse(
        path=file,
        media_type="audio/wav",
        filename=file.name,
    )