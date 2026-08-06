from __future__ import annotations

from dataclasses import dataclass


@dataclass(slots=True)
class Speaker:
    """
    A person identified in a conversation.
    """

    id: str

    conversation_id: str

    name: str

    role: str = "speaker"

    profile_image: str | None = None

    bio: str = ""

    website: str | None = None

    x: str | None = None

    linkedin: str | None = None

    verified: bool = False