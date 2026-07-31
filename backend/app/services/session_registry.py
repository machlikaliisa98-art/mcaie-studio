from __future__ import annotations

from threading import RLock

from app.models.session import Session


class SessionRegistry:

    def __init__(self):

        self._sessions: dict[str, Session] = {}

        self._lock = RLock()

    def create(
        self,
        session_id: str,
        title: str = "Untitled Session",
    ) -> Session:

        with self._lock:

            session = Session(
                id=session_id,
                title=title,
            )

            self._sessions[session_id] = session

            return session

    def get_or_create(
        self,
        session_id: str,
        title: str = "Untitled Session",
    ) -> Session:

        with self._lock:

            session = self._sessions.get(
                session_id
            )

            if session is None:

                session = Session(
                    id=session_id,
                    title=title,
                )

                self._sessions[
                    session_id
                ] = session

            return session

    def get(
        self,
        session_id: str,
    ) -> Session | None:

        with self._lock:

            return self._sessions.get(
                session_id
            )

    def exists(
        self,
        session_id: str,
    ) -> bool:

        with self._lock:

            return (
                session_id
                in self._sessions
            )

    def delete(
        self,
        session_id: str,
    ) -> None:

        with self._lock:

            self._sessions.pop(
                session_id,
                None,
            )

    def all(self) -> list[Session]:

        with self._lock:

            return list(
                self._sessions.values()
            )

    def serialize(self):

        with self._lock:

            return [

                session.serialize()

                for session

                in self._sessions.values()

            ]

    def __len__(self):

        return len(
            self._sessions
        )


registry = SessionRegistry()