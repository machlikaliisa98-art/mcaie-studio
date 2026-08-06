from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime


@dataclass(slots=True)
class Collection:
    """
    A user-curated collection of conversations.

    Examples

    • Leadership

    • Artificial Intelligence

    • Business

    • Faith

    • Saved for Later
    """

    id: str

    owner_id: str

    title: str

    description: str = ""

    public: bool = False

    cover_image: str | None = None

    created_at: datetime = field(
        default_factory=datetime.utcnow,
    )

    updated_at: datetime = field(
        default_factory=datetime.utcnow,
    )

    def rename(
        self,
        title: str,
    ) -> None:
        self.title = title
        self.updated_at = datetime.utcnow()

    def publish(self) -> None:
        self.public = True

    def unpublish(self) -> None:
        self.public = False