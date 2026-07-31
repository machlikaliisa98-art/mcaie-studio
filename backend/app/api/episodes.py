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

    return sorted(
        [
            {
                "id": index + 1,
                "title": f"Episode {index + 1:03d}",
                "filename": file.name,
                "job_id": job_id,
            }
            for index, file in enumerate(
                sorted(folder.glob("*.wav"))
            )
        ],
        key=lambda x: x["id"],
    )


@router.get("/file/{job_id}/{filename}")
def get_episode(
    job_id: str,
    filename: str,
):

    file = PROCESSED / job_id / filename

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