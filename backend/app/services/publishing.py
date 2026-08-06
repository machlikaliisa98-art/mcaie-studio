from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
import json
import shutil

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

    One publishing engine.

    Multiple destinations.

    Library
    Kyamagero Daily
    Future Shows
    """

    def __init__(self):

        self.outputs = OUTPUTS

        self.library = self.outputs / "library"

        self.shows = self.outputs / "shows"

        self.library.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.shows.mkdir(
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

        show: str = "kyamagero-daily",

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

        #
        # Publish to Library
        #

        library_file = self.library / f"{episode}.json"

        with open(

            library_file,

            "w",

            encoding="utf-8",

        ) as f:

            json.dump(

                published.__dict__,

                f,

                indent=4,

                ensure_ascii=False,

            )

        #
        # Publish to Show
        #

        show_folder = self.shows / show

        show_folder.mkdir(

            parents=True,

            exist_ok=True,

        )

        metadata = show_folder / f"{episode}.json"

        with open(

            metadata,

            "w",

            encoding="utf-8",

        ) as f:

            json.dump(

                published.__dict__,

                f,

                indent=4,

                ensure_ascii=False,

            )

        #
        # Copy Audio
        #

        source_audio = Path(audio)

        if source_audio.exists():

            shutil.copy2(

                source_audio,

                show_folder / source_audio.name,

            )

        print(f"Published -> Library : {episode}")
        print(f"Published -> Show    : {show}")

        return published


publisher = PublishingService()