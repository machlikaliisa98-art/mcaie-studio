from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(slots=True)
class Episode:
    """
    A published segment of a Conversation.

    A conversation may produce one or many episodes.
    """

    id: str

    conversation_id: str

    creator_id: str

    show_id: str

    series_id: str | None = None

    episode_number: int = 1

    title: str = ""

    description: str = ""

    start_time: float = 0.0

    end_time: float = 0.0

    duration: float = 0.0

    audio_path: str = ""

    waveform_path: str | None = None

    cover_image: str | None = None

    published: bool = False

    published_at: datetime | None = None

    created_at: datetime = field(
        default_factory=datetime.utcnow,
    )

    def publish(self) -> None:
        self.published = True
        self.published_at = datetime.utcnow()

    @property
    def length(self) -> float:
        return self.end_time - self.start_time