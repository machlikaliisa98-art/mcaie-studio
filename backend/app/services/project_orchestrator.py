from dataclasses import dataclass

from app.services.transcription import transcription
from app.services.summarization import summarizer
from app.services.projects import projects


@dataclass
class ProjectResult:

    project_id: str

    transcript: object | None = None

    summary: object | None = None


class ProjectOrchestrator:

    """
    MCAIE Project Orchestrator

    Coordinates every AI service
    involved in processing a project.

    The orchestrator never performs AI
    itself. It delegates work to the
    specialized services.
    """

    def process(

        self,

        project_id: str,

        audio_file: str,

    ) -> ProjectResult:

        #
        # Transcription
        #

        projects.update(

            project_id,

            status="Generating Transcript",

            progress=96,

        )

        transcript = transcription.transcribe(

            audio_file

        )

        #
        # Summarization
        #

        projects.update(

            project_id,

            status="Generating Summary",

            progress=98,

        )

        summary = summarizer.summarize(

            project_id=project_id,

            transcript=transcript.transcript,

        )

        #
        # Project Complete
        #

        projects.update(

            project_id,

            transcript_ready=True,

            summary_ready=True,

            status="Completed",

            progress=100,

            published=True,

        )

        return ProjectResult(

            project_id=project_id,

            transcript=transcript,

            summary=summary,

        )


orchestrator = ProjectOrchestrator()