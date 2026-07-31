from __future__ import annotations

from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
import json
import uuid

from app.config import STORAGE


PROJECTS = STORAGE / "projects"
PROJECTS.mkdir(parents=True, exist_ok=True)


@dataclass
class Project:

    id: str

    title: str

    mode: str

    status: str

    progress: int

    source_audio: str

    created_at: str

    updated_at: str

    duration: float = 0.0

    episode_count: int = 0

    transcript_ready: bool = False

    summary_ready: bool = False

    published: bool = False


class ProjectService:

    def create(

        self,

        title: str,

        mode: str,

        source_audio: str,

    ) -> Project:

        now = datetime.utcnow().isoformat()

        project = Project(

            id=uuid.uuid4().hex.upper()[:12],

            title=title,

            mode=mode,

            status="Created",

            progress=0,

            source_audio=source_audio,

            created_at=now,

            updated_at=now,

        )

        self.save(project)

        return project

    def save(

        self,

        project: Project,

    ):

        project.updated_at = datetime.utcnow().isoformat()

        file = PROJECTS / f"{project.id}.json"

        with open(

            file,

            "w",

            encoding="utf-8",

        ) as f:

            json.dump(

                asdict(project),

                f,

                indent=4,

            )

    def load(

        self,

        project_id: str,

    ) -> Project:

        file = PROJECTS / f"{project_id}.json"

        with open(

            file,

            encoding="utf-8",

        ) as f:

            return Project(

                **json.load(f)

            )

    def update(

        self,

        project_id: str,

        **kwargs,

    ):

        project = self.load(project_id)

        for key, value in kwargs.items():

            setattr(

                project,

                key,

                value,

            )

        self.save(project)

        return project

    def all(self):

        projects = []

        for file in sorted(

            PROJECTS.glob("*.json"),

            reverse=True,

        ):

            with open(

                file,

                encoding="utf-8",

            ) as f:

                projects.append(

                    json.load(f)

                )

        return projects


projects = ProjectService()