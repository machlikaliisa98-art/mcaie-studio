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

pipeline = ProductionPipeline()


@router.post("/upload")
async def upload_audio(

    file: UploadFile = File(...),

    mode: str = Form("podcast"),

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
    # Start Production Pipeline
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

        "project_id": project.id,

        "job_id": job_id,

        "mode": mode,

        "status": "created",

    }