from __future__ import annotations

import json

from fastapi import WebSocket

from app.services.connection_manager import manager


class SignalingManager:
    """
    Handles WebRTC signaling.

    Only forwards SDP offers, SDP answers and ICE candidates.
    """

    SIGNAL_TYPES = {
        "signal.offer",
        "signal.answer",
        "signal.ice",
    }

    async def handle(
        self,
        sender: WebSocket,
        message: dict,
    ) -> bool:
        """
        Returns True if the message was handled.
        """

        message_type = message.get("type")

        if message_type not in self.SIGNAL_TYPES:
            return False

        await manager.relay(
            sender,
            message,
        )

        return True

    async def relay_json(
        self,
        sender: WebSocket,
        payload: str,
    ) -> bool:

        try:

            message = json.loads(
                payload,
            )

        except Exception:

            return False

        return await self.handle(
            sender,
            message,
        )


signaling = SignalingManager()