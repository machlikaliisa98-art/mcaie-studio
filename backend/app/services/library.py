from dataclasses import dataclass
from pathlib import Path
import json

from app.config import OUTPUTS


@dataclass
class LibraryItem:

    project_id: str

    episode: str

    title: str

    audio: str

    transcript: str

    summary: str

    duration: float

    published_at: str


class LibraryService:

    """
    MCAIE Library Service

    Responsibilities

    • Build streaming library
    • Load published episodes
    • Continue Listening
    • Recently Published
    • Creator Library
    • Episode Discovery

    Every episode visible inside
    the frontend comes from here.
    """

    def __init__(self):

        self.library = OUTPUTS / "library"

        self.library.mkdir(

            parents=True,

            exist_ok=True,

        )

    def all(self):

        episodes = []

        for file in sorted(

            self.library.glob("*.json"),

            reverse=True,

        ):

            with open(

                file,

                encoding="utf-8",

            ) as f:

                episodes.append(

                    json.load(f)

                )

        return episodes

    def get(

        self,

        episode: str,

    ):

        file = self.library / f"{episode}.json"

        if not file.exists():

            return None

        with open(

            file,

            encoding="utf-8",

        ) as f:

            return json.load(f)

    def latest(

        self,

        limit: int = 10,

    ):

        return self.all()[:limit]


library = LibraryService()