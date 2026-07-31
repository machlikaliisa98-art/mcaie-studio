from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any
from uuid import uuid4


class ParticipantRole(str, Enum):
    HOST = "host"
    SPEAKER = "speaker"
    AUDIENCE = "audience"


class ParticipantState(str, Enum):
    CONNECTING = "connecting"
    CONNECTED = "connected"
    DISCONNECTED = "disconnected"


@dataclass(slots=True)
class Participant:

    id: str = field(default_factory=lambda: uuid4().hex)

    name: str = "Guest"

    role: ParticipantRole = ParticipantRole.AUDIENCE

    state: ParticipantState = ParticipantState.CONNECTING

    websocket_id: str | None = None

    joined_at: datetime = field(default_factory=datetime.utcnow)

    is_muted: bool = False

    camera_enabled: bool = True

    screen_sharing: bool = False

    hand_raised: bool = False

    metadata: dict[str, Any] = field(default_factory=dict)

    def connect(self) -> None:
        self.state = ParticipantState.CONNECTED

    def disconnect(self) -> None:
        self.state = ParticipantState.DISCONNECTED

    def raise_hand(self) -> None:
        self.hand_raised = True

    def lower_hand(self) -> None:
        self.hand_raised = False

    def mute(self) -> None:
        self.is_muted = True

    def unmute(self) -> None:
        self.is_muted = False

    def enable_camera(self) -> None:
        self.camera_enabled = True

    def disable_camera(self) -> None:
        self.camera_enabled = False

    def start_screen_share(self) -> None:
        self.screen_sharing = True

    def stop_screen_share(self) -> None:
        self.screen_sharing = False

    def promote_to_speaker(self) -> None:
        self.role = ParticipantRole.SPEAKER

    def demote_to_audience(self) -> None:
        self.role = ParticipantRole.AUDIENCE

    def make_host(self) -> None:
        self.role = ParticipantRole.HOST

    def serialize(self) -> dict[str, Any]:

        return {
            "id": self.id,
            "name": self.name,
            "role": self.role.value,
            "state": self.state.value,
            "joinedAt": self.joined_at.isoformat(),
            "muted": self.is_muted,
            "cameraEnabled": self.camera_enabled,
            "screenSharing": self.screen_sharing,
            "handRaised": self.hand_raised,
            "metadata": self.metadata,
        }