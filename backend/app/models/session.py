from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Dict

from app.models.participant import Participant


@dataclass(slots=True)
class Session:

    id: str

    title: str = "Untitled Session"

    created_at: datetime = field(
        default_factory=datetime.utcnow,
    )

    status: str = "waiting"

    recording: bool = False

    host_id: str | None = None

    participants: Dict[str, Participant] = field(
        default_factory=dict,
    )

    def add_participant(
        self,
        participant: Participant,
    ) -> None:

        self.participants[participant.id] = participant

        if self.host_id is None:

            self.host_id = participant.id

            participant.make_host()

        participant.connect()

        self.status = "active"

    def remove_participant(
        self,
        participant_id: str,
    ) -> None:

        participant = self.participants.pop(
            participant_id,
            None,
        )

        if participant is None:
            return

        participant.disconnect()

        if not self.participants:

            self.status = "ended"

            self.host_id = None

            return

        if participant_id == self.host_id:

            new_host = next(
                iter(
                    self.participants.values()
                )
            )

            new_host.make_host()

            self.host_id = new_host.id

    def get_participant(
        self,
        participant_id: str,
    ) -> Participant | None:

        return self.participants.get(
            participant_id
        )

    def raise_hand(
        self,
        participant_id: str,
    ) -> None:

        participant = self.get_participant(
            participant_id
        )

        if participant:

            participant.raise_hand()

    def lower_hand(
        self,
        participant_id: str,
    ) -> None:

        participant = self.get_participant(
            participant_id
        )

        if participant:

            participant.lower_hand()

    def promote_to_stage(
        self,
        participant_id: str,
    ) -> None:

        participant = self.get_participant(
            participant_id
        )

        if participant:

            participant.promote_to_speaker()

            participant.lower_hand()

    def remove_from_stage(
        self,
        participant_id: str,
    ) -> None:

        participant = self.get_participant(
            participant_id
        )

        if (
            participant
            and participant.id != self.host_id
        ):

            participant.demote_to_audience()

    def speakers(self):

        return [

            participant

            for participant

            in self.participants.values()

            if participant.role.value
            in (
                "host",
                "speaker",
            )

        ]

    def audience(self):

        return [

            participant

            for participant

            in self.participants.values()

            if participant.role.value
            == "audience"

        ]

    def raised_hands(self):

        return [

            participant

            for participant

            in self.participants.values()

            if participant.hand_raised

        ]

    def serialize(self):

        return {

            "id": self.id,

            "title": self.title,

            "status": self.status,

            "host": self.host_id,

            "recording": self.recording,

            "createdAt": self.created_at.isoformat(),

            "participants": [

                participant.serialize()

                for participant

                in self.participants.values()

            ],

            "speakers": [

                participant.id

                for participant

                in self.speakers()

            ],

            "raisedHands": [

                participant.id

                for participant

                in self.raised_hands()

            ],

        }