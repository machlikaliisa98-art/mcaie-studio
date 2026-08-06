from dataclasses import dataclass

from app.services.transcription import transcription
from app.services.summarization import summarizer
from app.services.projects import projects
from app.services.show_publisher import publisher


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
    """

    def process(

        self,

        project_id: str,

        audio_file: str,

    ) -> ProjectResult:

        #
        # Generate Transcript
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
        # Generate Summary
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
        # Load latest project
        #

        project = projects.load(

            project_id

        ).__dict__

        #
        # Publish into Kyamagero Daily
        #

        publisher.publish(

            show="kyamagero-daily",

            project=project,

            transcript=transcript.transcript,

            executive_summary=summary.executive,

            plain_summary=summary.plain_language,

        )

        #
        # Finish Project
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