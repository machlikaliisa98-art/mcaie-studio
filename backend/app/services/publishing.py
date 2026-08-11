from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
import json
import shutil
import subprocess

from app.config import (
    OUTPUTS,
    FFPROBE,
)


@dataclass
class PublishedEpisode:

    project_id: str

    episode: str

    title: str

    published_at: str

    audio: str

    duration: float

    show: str

    programme: str

    season: int

    episode_number: int

    transcript: str = ""

    summary: str = ""

    @property
    def metadata(self):
        return asdict(self)


class PublishingService:

    """
    FONS Publishing Service.

    Publishing is independent of AI processing.

    An episode may contain:

        audio only

    or:

        audio
        transcript
        summary

    depending entirely on what MCAIE produced.

    The publishing service owns the permanent public
    episode identity and numbering.
    """

    def __init__(self):

        self.outputs = OUTPUTS

        self.library = (
            self.outputs /
            "library"
        )

        self.shows = (
            self.outputs /
            "shows"
        )

        self.library.mkdir(
            parents=True,
            exist_ok=True,
        )

        self.shows.mkdir(
            parents=True,
            exist_ok=True,
        )

    # ==========================================================
    # DURATION
    # ==========================================================

    def _duration(
        self,
        audio_file: Path,
    ) -> float:

        try:

            result = subprocess.run(
                [
                    FFPROBE,
                    "-v",
                    "error",
                    "-show_entries",
                    "format=duration",
                    "-of",
                    "default=noprint_wrappers=1:nokey=1",
                    str(audio_file),
                ],
                capture_output=True,
                text=True,
                check=True,
            )

            return float(
                result.stdout.strip()
            )

        except Exception as error:

            print(
                "Unable to determine "
                f"audio duration: {error}"
            )

            return 0.0

    # ==========================================================
    # SLUGIFY
    # ==========================================================

    @staticmethod
    def _slugify(
        value: str,
    ) -> str:

        value = (
            value
            .strip()
            .lower()
        )

        characters = []

        for character in value:

            if character.isalnum():

                characters.append(
                    character
                )

            elif character in (
                " ",
                "-",
                "_",
            ):

                characters.append("-")

        slug = "".join(
            characters
        )

        while "--" in slug:

            slug = slug.replace(
                "--",
                "-",
            )

        return slug.strip("-")

    # ==========================================================
    # NEXT EPISODE NUMBER
    # ==========================================================

    def _next_episode_number(
        self,
        season_folder: Path,
    ) -> int:

        highest = 0

        if not season_folder.exists():

            return 1

        # ------------------------------------------------------
        # Metadata
        # ------------------------------------------------------

        for metadata_file in season_folder.glob(
            "*.json"
        ):

            try:

                number = int(
                    metadata_file.stem
                )

                if number > highest:

                    highest = number

            except ValueError:

                continue

        # ------------------------------------------------------
        # Audio safety check
        # ------------------------------------------------------

        for audio_file in season_folder.glob(
            "*.wav"
        ):

            try:

                number = int(
                    audio_file.stem
                )

                if number > highest:

                    highest = number

            except ValueError:

                continue

        return highest + 1

    # ==========================================================
    # PUBLISH
    # ==========================================================

    def publish(

        self,

        project_id: str,

        episode: str,

        title: str,

        audio: str,

        duration: float = 0.0,

        show: str = "kyamagero-daily",

        programme: str = "",

        season: int = 1,

        episode_number: int = 1,

        transcript: str = "",

        summary: str = "",

    ) -> PublishedEpisode:

        # ------------------------------------------------------
        # SAFETY
        # ------------------------------------------------------

        if season < 1:

            season = 1

        # ------------------------------------------------------
        # SOURCE AUDIO
        # ------------------------------------------------------

        source_audio = Path(
            audio
        )

        if not source_audio.exists():

            raise FileNotFoundError(
                "Audio file not found: "
                f"{source_audio}"
            )

        # ------------------------------------------------------
        # DURATION
        # ------------------------------------------------------

        if duration <= 0:

            duration = self._duration(
                source_audio
            )

        # ------------------------------------------------------
        # TIMESTAMP
        # ------------------------------------------------------

        published_at = (
            datetime.now(
                timezone.utc
            ).isoformat()
        )

        # ------------------------------------------------------
        # SHOW
        # ------------------------------------------------------

        show_folder = (
            self.shows /
            show
        )

        show_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ------------------------------------------------------
        # PROGRAMME
        # ------------------------------------------------------

        programme_name = (
            programme.strip()
            if programme
            else "General"
        )

        programme_slug = (
            self._slugify(
                programme_name
            )
            or "general"
        )

        programme_folder = (
            show_folder /
            "programmes" /
            programme_slug
        )

        programme_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ------------------------------------------------------
        # SEASON
        # ------------------------------------------------------

        season_folder = (
            programme_folder /
            f"season_{season:03d}"
        )

        season_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ------------------------------------------------------
        # PERMANENT PUBLIC EPISODE NUMBER
        #
        # The pipeline's episode number is NOT trusted.
        #
        # The publisher determines the next number from
        # the actual published programme/season.
        # ------------------------------------------------------

        episode_number = (
            self._next_episode_number(
                season_folder
            )
        )

        # ------------------------------------------------------
        # PUBLIC AUDIO FILENAME
        # ------------------------------------------------------

        published_filename = (
            f"{episode_number:03d}"
            f"{source_audio.suffix.lower()}"
        )

        destination_audio = (
            season_folder /
            published_filename
        )

        # ------------------------------------------------------
        # NEVER OVERWRITE
        # ------------------------------------------------------

        while destination_audio.exists():

            episode_number += 1

            published_filename = (
                f"{episode_number:03d}"
                f"{source_audio.suffix.lower()}"
            )

            destination_audio = (
                season_folder /
                published_filename
            )

        # ------------------------------------------------------
        # COPY AUDIO
        # ------------------------------------------------------

        shutil.copy2(
            source_audio,
            destination_audio,
        )

        # ------------------------------------------------------
        # CANONICAL PUBLIC IDENTITY
        #
        # IMPORTANT:
        #
        # Never expose:
        #
        # episode_000
        # episode_001
        #
        # as the public episode identity.
        # ------------------------------------------------------

        public_episode_id = (
            f"{episode_number:03d}"
        )

        episode_title = (
            f"{programme_name} "
            f"Season {season} "
            f"Episode {episode_number}"
        )

        # ------------------------------------------------------
        # PUBLISHED OBJECT
        # ------------------------------------------------------

        published = PublishedEpisode(

            project_id=project_id,

            episode=public_episode_id,

            title=episode_title,

            published_at=published_at,

            audio=str(
                destination_audio
            ),

            duration=duration,

            show=show,

            programme=programme_name,

            season=season,

            episode_number=episode_number,

            transcript=(
                transcript or ""
            ),

            summary=(
                summary or ""
            ),
        )

        # ------------------------------------------------------
        # METADATA
        # ------------------------------------------------------

        metadata = {

            **published.metadata,

            "season_title":
                f"Season {season}",

            "episode_title":
                episode_title,

            "episode_number":
                episode_number,

            "audio_filename":
                published_filename,

            "programme_title":
                programme_name,

            "programme_id":
                programme_slug,

            "season_id":
                f"season_{season:03d}",
        }

        # ------------------------------------------------------
        # EPISODE METADATA
        # ------------------------------------------------------

        metadata_file = (
            season_folder /
            f"{episode_number:03d}.json"
        )

        with open(
            metadata_file,
            "w",
            encoding="utf-8",
        ) as file:

            json.dump(
                metadata,
                file,
                indent=4,
                ensure_ascii=False,
            )

        # ------------------------------------------------------
        # LIBRARY COPY
        # ------------------------------------------------------

        library_folder = (
            self.library /
            show /
            programme_slug /
            f"season_{season:03d}"
        )

        library_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        library_audio = (
            library_folder /
            published_filename
        )

        shutil.copy2(
            source_audio,
            library_audio,
        )

        library_metadata = (
            library_folder /
            f"{episode_number:03d}.json"
        )

        library_data = {

            **metadata,

            "audio": str(
                library_audio
            ),
        }

        with open(
            library_metadata,
            "w",
            encoding="utf-8",
        ) as file:

            json.dump(
                library_data,
                file,
                indent=4,
                ensure_ascii=False,
            )

        # ------------------------------------------------------
        # LOG
        # ------------------------------------------------------

        print()
        print("=" * 60)
        print("FONS PUBLISH")
        print("=" * 60)

        print(
            f"Show       : {show}"
        )

        print(
            f"Programme  : {programme_name}"
        )

        print(
            f"Season     : {season}"
        )

        print(
            f"Episode    : {episode_number}"
        )

        print(
            f"Title      : {episode_title}"
        )

        print(
            f"Audio      : {destination_audio}"
        )

        print(
            f"Duration   : {duration:.2f}s"
        )

        print(
            "Transcript : "
            + (
                "YES"
                if transcript
                else "NO"
            )
        )

        print(
            "Summary    : "
            + (
                "YES"
                if summary
                else "NO"
            )
        )

        print("=" * 60)

        return published


publisher = PublishingService()