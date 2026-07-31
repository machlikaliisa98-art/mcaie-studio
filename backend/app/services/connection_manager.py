from __future__ import annotations

import json
from uuid import uuid4

from fastapi import WebSocket

from app.models.participant import (
    Participant,
    ParticipantRole,
)
from app.services.session_registry import registry


class ConnectionManager:

    def __init__(self):

        self.connections: dict[WebSocket, tuple[str, str]] = {}

        self.websockets: dict[str, WebSocket] = {}

    async def connect(
        self,
        session_id: str,
        websocket: WebSocket,
    ) -> Participant:

        await websocket.accept()

        session = registry.get_or_create(session_id)

        participant = Participant(
            id=uuid4().hex,
            websocket_id=str(id(websocket)),
            name="Guest",
        )

        session.add_participant(participant)

        self.connections[websocket] = (
            session_id,
            participant.id,
        )

        self.websockets[
            participant.id
        ] = websocket

        await websocket.send_json(
            {
                "type": "participant_registered",
                "participantId": participant.id,
                "payload": {
                    "role": participant.role.value,
                },
            }
        )

        await self.broadcast(
            session_id,
            {
                "type": "participant_joined",
                "participant": self.serialize_participant(
                    participant
                ),
            },
        )

        await self.broadcast_participants(
            session_id,
        )

        return participant

    async def disconnect(
        self,
        websocket: WebSocket,
    ):

        info = self.connections.pop(
            websocket,
            None,
        )

        if info is None:
            return

        session_id, participant_id = info

        self.websockets.pop(
            participant_id,
            None,
        )

        session = registry.get(session_id)

        if session is None:
            return

        session.remove_participant(
            participant_id,
        )

        await self.broadcast(
            session_id,
            {
                "type": "participant_left",
                "participantId": participant_id,
            },
        )

        await self.broadcast_participants(
            session_id,
        )

        if session.status == "ended":

            registry.delete(
                session_id,
            )

    async def relay(
        self,
        sender: WebSocket,
        payload,
    ):

        info = self.connections.get(
            sender,
        )

        if info is None:
            return

        session_id, sender_id = info

        if isinstance(payload, str):

            message = json.loads(payload)

        else:

            message = payload

        target = (
            message.get("to")
            or message.get("payload", {}).get("target")
        )

        if not target:

            message["participantId"] = sender_id

            await self.broadcast(
                session_id,
                message,
            )

            return

        socket = self.websockets.get(target)

        if socket is None:
            return

        if "payload" in message:

            inner = dict(
                message["payload"]
            )

            inner.pop(
                "target",
                None,
            )

            message["payload"] = inner

        message["from"] = sender_id

        message["to"] = target

        try:

            await socket.send_json(
                message,
            )

        except Exception:

            await self.disconnect(
                socket,
            )

    async def broadcast(
        self,
        session_id: str,
        payload: dict,
    ):

        dead = []

        for socket, (
            room,
            _,
        ) in self.connections.items():

            if room != session_id:
                continue

            try:

                await socket.send_json(
                    payload,
                )

            except Exception:

                dead.append(socket)

        for socket in dead:

            await self.disconnect(
                socket,
            )

    async def broadcast_participants(
        self,
        session_id: str,
    ):

        session = registry.get(
            session_id,
        )

        if session is None:
            return

        await self.broadcast(
            session_id,
            {
                "type": "participants",
                "participants": [
                    self.serialize_participant(p)
                    for p in session.participants.values()
                ],
            },
        )

    def serialize_participant(
        self,
        participant: Participant,
    ):

        return {
            "id": participant.id,
            "name": participant.name,
            "role": participant.role.value,
            "camera": participant.camera_enabled,
            "microphone": not participant.is_muted,
            "screen": participant.screen_sharing,
            "handRaised": participant.hand_raised,
            "onStage": participant.role
            in (
                ParticipantRole.HOST,
                ParticipantRole.SPEAKER,
            ),
        }


manager = ConnectionManager()