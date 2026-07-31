from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
import json

from app.config import OUTPUTS


@dataclass
class PublishedEpisode:

    project_id: str

    episode: str

    title: str

    published_at: str

    audio: str

    transcript: str

    summary: str

    duration: float


class PublishingService:

    """
    MCAIE Publishing Service

    Responsibilities

    • Publish projects
    • Build streaming library
    • Generate metadata
    • Create searchable catalog
    """

    def __init__(self):

        self.library = OUTPUTS / "library"

        self.library.mkdir(

            parents=True,

            exist_ok=True,

        )

    def publish(

        self,

        project_id: str,

        episode: str,

        title: str,

        audio: str,

        transcript: str = "",

        summary: str = "",

        duration: float = 0.0,

    ) -> PublishedEpisode:

        published = PublishedEpisode(

            project_id=project_id,

            episode=episode,

            title=title,

            published_at=datetime.utcnow().isoformat(),

            audio=audio,

            transcript=transcript,

            summary=summary,

            duration=duration,

        )

        with open(

            self.library / f"{episode}.json",

            "w",

            encoding="utf-8",

        ) as f:

            json.dump(

                published.__dict__,

                f,

                indent=4,

                ensure_ascii=False,

            )

        return published


publisher = PublishingService()