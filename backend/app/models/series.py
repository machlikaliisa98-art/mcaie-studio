from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(slots=True)
class Series:
    """
    Groups related conversations into an ordered journey.

    Example:

    You Rise Surrounded

        Episode 1

        Episode 2

        Episode 3
    """

    id: str

    creator_id: str

    show_id: str

    title: str

    description: str = ""

    cover_image: str | None = None

    season: int = 1

    published: bool = False

    created_at: datetime = field(
        default_factory=datetime.utcnow,
    )

    def publish(self) -> None:
        self.published = True