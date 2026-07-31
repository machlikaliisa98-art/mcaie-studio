from collections import defaultdict

from fastapi import APIRouter, WebSocket, WebSocketDisconnect


router = APIRouter(tags=["WebSocket"])


class ConnectionManager:

    def __init__(self):

        self.rooms = defaultdict(set)

    async def connect(

        self,

        session_id: str,

        websocket: WebSocket,

    ):

        await websocket.accept()

        self.rooms[session_id].add(websocket)

    def disconnect(

        self,

        session_id: str,

        websocket: WebSocket,

    ):

        if session_id in self.rooms:

            self.rooms[session_id].discard(

                websocket,

            )

            if not self.rooms[session_id]:

                del self.rooms[session_id]

    async def broadcast(

        self,

        session_id: str,

        event: str,

        payload: dict,

    ):

        if session_id not in self.rooms:

            return

        dead = []

        message = {

            "event": event,

            "payload": payload,

        }

        for socket in self.rooms[session_id]:

            try:

                await socket.send_json(

                    message,

                )

            except Exception:

                dead.append(socket)

        for socket in dead:

            self.disconnect(

                session_id,

                socket,

            )


manager = ConnectionManager()


@router.websocket("/ws/{session_id}")
async def websocket_endpoint(

    websocket: WebSocket,

    session_id: str,

):

    await manager.connect(

        session_id,

        websocket,

    )

    try:

        while True:

            await websocket.receive_text()

    except WebSocketDisconnect:

        manager.disconnect(

            session_id,

            websocket,

        )