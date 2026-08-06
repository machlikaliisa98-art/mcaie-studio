from __future__ import annotations

import json
import shutil
from datetime import datetime
from pathlib import Path

from app.config import STORAGE


SHOWS = STORAGE / "shows"


class ShowPublisher:
    """
    Publishes completed MCAIE productions
    into a FONS Show.

    Every completed conversation becomes
    immediately available to the selected show.
    """

    def __init__(self):

        SHOWS.mkdir(
            parents=True,
            exist_ok=True,
        )

    def publish(

        self,

        show: str,

        project: dict,

        transcript: str,

        executive_summary: str,

        plain_summary: str,

    ):

        print("=" * 70)
        print("FONS SHOW PUBLISHER")
        print(f"Show       : {show}")
        print(f"Project    : {project['title']}")
        print(f"Project ID : {project['id']}")
        print("=" * 70)

        show_folder = SHOWS / show

        show_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        #
        # Copy processed audio
        #

        audio = Path(project["source_audio"])

        destination_audio = show_folder / audio.name

        if audio.exists():

            shutil.copy2(
                audio,
                destination_audio,
            )

            print(f"✓ Audio copied : {destination_audio}")

        else:

            print(f"✗ Audio missing : {audio}")

        #
        # Build metadata
        #

        metadata = {

            "project_id": project["id"],

            "title": project["title"],

            "status": project["status"],

            "created_at": project["created_at"],

            "updated_at": datetime.utcnow().isoformat(),

            "audio": destination_audio.name,

            "transcript": transcript,

            "executive_summary": executive_summary,

            "plain_summary": plain_summary,

        }

        metadata_file = show_folder / f"{project['id']}.json"

        with open(

            metadata_file,

            "w",

            encoding="utf-8",

        ) as f:

            json.dump(

                metadata,

                f,

                indent=4,

                ensure_ascii=False,

            )

        print(f"✓ Metadata saved : {metadata_file}")
        print("✓ Publishing Complete")
        print("=" * 70)


publisher = ShowPublisher()