from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from app.services.connection_manager import manager
from app.services.session_registry import registry


router = APIRouter(
    tags=["WebSocket"],
)


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    session_id: str,
):

    participant = await manager.connect(
        session_id,
        websocket,
    )

    await websocket.send_json(
        {
            "type": "participant_registered",
            "participantId": participant.id,
            "payload": {
                "role": participant.role,
            },
        }
    )

    try:

        while True:

            message = await websocket.receive_json()

            message_type = message.get("type")

            session = registry.get(
                session_id,
            )

            #
            # Raise Hand
            #
            if message_type == "raise_hand":

                if session:

                    session.raise_hand(
                        participant.id,
                    )

                    await manager.broadcast(
                        session_id,
                        {
                            "type": "session_updated",
                            "session": session.serialize(),
                        },
                    )

                continue

            #
            # Approve Speaker
            #
            if message_type == "approve_speaker":

                if session:

                    target = message.get(
                        "participantId",
                    )

                    if target:

                        session.promote_to_stage(
                            target,
                        )

                        await manager.broadcast(
                            session_id,
                            {
                                "type": "session_updated",
                                "session": session.serialize(),
                            },
                        )

                continue

            #
            # Remove Speaker
            #
            if message_type == "remove_speaker":

                if session:

                    target = message.get(
                        "participantId",
                    )

                    if (
                        target
                        and target != session.host_id
                    ):

                        session.remove_from_stage(
                            target,
                        )

                        await manager.broadcast(
                            session_id,
                            {
                                "type": "session_updated",
                                "session": session.serialize(),
                            },
                        )

                continue

            #
            # Toggle Camera
            #
            if message_type == "camera":

                if session:

                    participant.camera = bool(
                        message.get(
                            "enabled",
                            False,
                        )
                    )

                    await manager.broadcast_participants(
                        session_id,
                    )

                continue

            #
            # Toggle Microphone
            #
            if message_type == "microphone":

                if session:

                    participant.microphone = bool(
                        message.get(
                            "enabled",
                            False,
                        )
                    )

                    await manager.broadcast_participants(
                        session_id,
                    )

                continue

            #
            # Toggle Screen Share
            #
            if message_type == "screen":

                if session:

                    participant.screen = bool(
                        message.get(
                            "enabled",
                            False,
                        )
                    )

                    await manager.broadcast_participants(
                        session_id,
                    )

                continue

            #
            # Relay everything else
            # (offer / answer / ice / custom events)
            #
            await manager.relay(
                websocket,
                message,
            )

    except WebSocketDisconnect:

        await manager.disconnect(
            websocket,
        )

    except Exception as exc:

        print(
            "[WebSocket Error]",
            exc,
        )

        await manager.disconnect(
            websocket,
        )