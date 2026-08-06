from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(slots=True)
class Show:
    """
    A branded publishing space owned by a creator.

    Examples:
        - Kyamagero Daily
        - Man Cave UG
        - TED Talks
        - BBC Global News Podcast
    """

    id: str

    creator_id: str

    name: str

    description: str = ""

    tagline: str = ""

    language: str = "English"

    logo: str | None = None

    cover_image: str | None = None

    visibility: str = "public"

    created_at: datetime = field(
        default_factory=datetime.utcnow,
    )

    archived: bool = False

    def archive(self) -> None:
        self.archived = True

    def restore(self) -> None:
        self.archived = False