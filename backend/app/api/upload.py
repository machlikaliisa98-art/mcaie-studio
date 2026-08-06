from pathlib import Path
from uuid import uuid4
import shutil
import threading

from fastapi import APIRouter, File, Form, UploadFile

from app.api.jobs import create_job
from app.engine.pipeline import ProductionPipeline
from app.services.projects import projects
from app.config import UPLOADS

router = APIRouter(tags=["Upload"])


@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...),

    # Project Mode
    mode: str = Form("podcast"),

    # Audio Processing (kept for future UI)
    enhance_audio: bool = Form(True),
    normalize_audio: bool = Form(True),

    # AI Processing (kept for future UI)
    transcribe: bool = Form(True),
    summarize: bool = Form(True),
    keywords: bool = Form(True),
    topics: bool = Form(True),
    chapters: bool = Form(True),
    speaker_identification: bool = Form(True),

    # Episode Splitting
    split_audio: bool = Form(False),
    split_method: str = Form("ai"),
    split_minutes: int = Form(20),

    # Publishing
    publish_to: str = Form("download"),
):

    #
    # Create Job ID
    #

    job_id = uuid4().hex[:8].upper()

    #
    # Save uploaded recording
    #

    destination = UPLOADS / f"{job_id}{Path(file.filename).suffix}"

    destination.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(destination, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer,
        )

    #
    # Create Project
    #

    project = projects.create(
        title=Path(file.filename).stem,
        mode=mode,
        source_audio=str(destination),
    )

    #
    # Create Processing Job
    #

    create_job(job_id)

    #
    # Create Production Pipeline
    #

    pipeline = ProductionPipeline()

    #
    # Start Processing
    #

    threading.Thread(
        target=pipeline.process,
        kwargs={
            "project_id": project.id,
            "job_id": job_id,
            "audio_file": str(destination),
            "mode": mode,
        },
        daemon=True,
    ).start()

    #
    # Response
    #

    return {
        "status": "created",
        "project_id": project.id,
        "job_id": job_id,
        "configuration": {
            "mode": mode,
            "audio": {
                "enhance_audio": enhance_audio,
                "normalize_audio": normalize_audio,
            },
            "ai": {
                "transcribe": transcribe,
                "summarize": summarize,
                "keywords": keywords,
                "topics": topics,
                "chapters": chapters,
                "speaker_identification": speaker_identification,
            },
            "splitting": {
                "enabled": split_audio,
                "method": split_method,
                "minutes": split_minutes,
            },
            "publishing": {
                "destination": publish_to,
            },
        },
    }