from fastapi import APIRouter, HTTPException

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"],
)

_jobs = {}


def create_job(job_id: str):

    _jobs[job_id] = {

        "job_id": job_id,

        "stage": "Starting",

        "progress": 0,

    }


def update_job(
    job_id,
    stage,
    progress,
):

    if job_id not in _jobs:

        return

    _jobs[job_id]["stage"] = stage

    _jobs[job_id]["progress"] = progress


def complete_job(job_id):

    if job_id not in _jobs:

        return

    _jobs[job_id]["stage"] = "Completed"

    _jobs[job_id]["progress"] = 100


@router.get("/{job_id}")
def get_job(job_id):

    if job_id not in _jobs:

        raise HTTPException(
            status_code=404,
            detail="Job not found",
        )

    return _jobs[job_id]