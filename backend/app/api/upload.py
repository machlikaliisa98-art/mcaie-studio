from pathlib import Path
from uuid import uuid4
import shutil
import threading

from fastapi import APIRouter, File, Form, UploadFile

from app.api.jobs import create_job
from app.engine.pipeline import (
    ProductionPipeline,
    ProcessingOptions,
)
from app.services.projects import projects
from app.config import UPLOADS


router = APIRouter(
    tags=["Upload"]
)


@router.post("/upload")
async def upload_audio(
    file: UploadFile = File(...),

    # ==========================================================
    # PROJECT MODE
    # ==========================================================

    mode: str = Form("podcast"),

    # ==========================================================
    # AUDIO PROCESSING
    # ==========================================================

    enhance_audio: bool = Form(False),
    normalize_audio: bool = Form(False),

    # ==========================================================
    # AI PROCESSING
    # ==========================================================

    transcribe: bool = Form(False),
    summarize: bool = Form(False),
    keywords: bool = Form(False),
    topics: bool = Form(False),
    chapters: bool = Form(False),
    speaker_identification: bool = Form(False),

    # ==========================================================
    # EPISODE SPLITTING
    # ==========================================================

    split_audio: bool = Form(False),
    split_method: str = Form("fixed"),
    split_minutes: int = Form(20),

    # ==========================================================
    # PUBLISHING
    # ==========================================================

    publish_to: str = Form("download"),

    # ==========================================================
    # AUDIO PRESERVATION
    # ==========================================================

    preserve_audio: bool = Form(True),
):

    # ==========================================================
    # CREATE JOB ID
    # ==========================================================

    job_id = uuid4().hex[:8].upper()

    # ==========================================================
    # SAVE ORIGINAL UPLOAD
    # ==========================================================

    if not file.filename:
        raise ValueError(
            "Uploaded file must have a filename."
        )

    destination = (
        UPLOADS /
        f"{job_id}{Path(file.filename).suffix}"
    )

    destination.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with open(
        destination,
        "wb",
    ) as buffer:

        shutil.copyfileobj(
            file.file,
            buffer,
        )

    # ==========================================================
    # CREATE PROJECT
    # ==========================================================

    project = projects.create(
        title=Path(file.filename).stem,
        mode=mode,
        source_audio=str(destination),
    )

    # ==========================================================
    # CREATE JOB
    # ==========================================================

    create_job(job_id)

    # ==========================================================
    # BUILD PROCESSING CONFIGURATION
    #
    # THIS IS THE IMPORTANT PART.
    #
    # Every Studio checkbox now becomes part of the actual
    # MCAIE ProcessingOptions object.
    # ==========================================================

    options = ProcessingOptions(

        # Audio
        enhance_audio=enhance_audio,
        normalize_audio=normalize_audio,

        # AI
        transcribe=transcribe,
        summarize=summarize,
        keywords=keywords,
        topics=topics,
        chapters=chapters,
        speaker_identification=(
            speaker_identification
        ),

        # Splitting
        split_audio=split_audio,
        split_method=split_method,
        split_minutes=split_minutes,

        # Publishing
        publish_to=publish_to,

        # Preservation
        preserve_audio=preserve_audio,
    )

    # ==========================================================
    # PRINT EXACT USER REQUEST
    # ==========================================================

    print()
    print("=" * 70)
    print("NEW MCAIE JOB")
    print("=" * 70)

    print(
        f"Job ID              : {job_id}"
    )

    print(
        f"Project ID          : {project.id}"
    )

    print(
        f"Mode                : {mode}"
    )

    print()
    print("USER REQUEST")
    print("-" * 70)

    print(
        f"Enhance Audio       : "
        f"{options.enhance_audio}"
    )

    print(
        f"Normalize Audio     : "
        f"{options.normalize_audio}"
    )

    print(
        f"Transcribe          : "
        f"{options.transcribe}"
    )

    print(
        f"Summarize           : "
        f"{options.summarize}"
    )

    print(
        f"Keywords            : "
        f"{options.keywords}"
    )

    print(
        f"Topics              : "
        f"{options.topics}"
    )

    print(
        f"Chapters            : "
        f"{options.chapters}"
    )

    print(
        f"Speaker Identification : "
        f"{options.speaker_identification}"
    )

    print(
        f"Split Audio         : "
        f"{options.split_audio}"
    )

    print(
        f"Split Method        : "
        f"{options.split_method}"
    )

    print(
        f"Split Minutes       : "
        f"{options.split_minutes}"
    )

    print(
        f"Preserve Audio      : "
        f"{options.preserve_audio}"
    )

    print(
        f"Publish To          : "
        f"{options.publish_to}"
    )

    print("=" * 70)
    print()

    # ==========================================================
    # CREATE PIPELINE
    # ==========================================================

    pipeline = ProductionPipeline()

    # ==========================================================
    # START PROCESSING
    # ==========================================================

    threading.Thread(
        target=pipeline.process,
        kwargs={
            "project_id": project.id,
            "job_id": job_id,
            "audio_file": str(destination),
            "mode": mode,
            "options": options,
        },
        daemon=True,
    ).start()

    # ==========================================================
    # RETURN
    # ==========================================================

    return {
        "status": "created",

        "project_id": project.id,

        "job_id": job_id,

        "configuration": {

            "mode": mode,

            "audio": {
                "enhance_audio":
                    enhance_audio,

                "normalize_audio":
                    normalize_audio,
            },

            "ai": {
                "transcribe":
                    transcribe,

                "summarize":
                    summarize,

                "keywords":
                    keywords,

                "topics":
                    topics,

                "chapters":
                    chapters,

                "speaker_identification":
                    speaker_identification,
            },

            "splitting": {
                "enabled":
                    split_audio,

                "method":
                    split_method,

                "minutes":
                    split_minutes,

                "preserve_audio":
                    preserve_audio,
            },

            "publishing": {
                "destination":
                    publish_to,
            },
        },
    }