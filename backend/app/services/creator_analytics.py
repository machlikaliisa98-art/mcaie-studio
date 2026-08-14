from datetime import datetime, timezone, timedelta

from app.database.session import SessionLocal
from app.models.listener_analytics import (
    ListenerEvent,
    ListenerSession,
)


class CreatorAnalyticsService:

    # ==========================================================
    # LISTENER SESSION
    # ==========================================================

    def start_session(
        self,
        listener_id: str,
        creator_id: str,
        show_id: str,
        episode_id: str,
        duration: float = 0.0,
    ):
        db = SessionLocal()

        try:
            session_id = (
                f"{listener_id}-"
                f"{datetime.now(timezone.utc).timestamp()}"
            )

            session = ListenerSession(
                session_id=session_id,
                listener_id=listener_id,
                creator_id=creator_id,
                show_id=show_id,
                episode_id=episode_id,
                position=0.0,
                duration=duration,
            )

            db.add(session)

            db.add(
                ListenerEvent(
                    event_type="play",
                    listener_id=listener_id,
                    session_id=session_id,
                    creator_id=creator_id,
                    show_id=show_id,
                    episode_id=episode_id,
                    position=0.0,
                    duration=duration,
                )
            )

            db.commit()

            return {
                "session_id": session_id,
                "listener_id": listener_id,
                "creator_id": creator_id,
                "show_id": show_id,
                "episode_id": episode_id,
            }

        finally:
            db.close()

    # ==========================================================
    # HEARTBEAT
    # ==========================================================

    def heartbeat(
        self,
        session_id: str,
        position: float,
    ):
        db = SessionLocal()

        try:
            session = (
                db.query(ListenerSession)
                .filter(
                    ListenerSession.session_id == session_id
                )
                .first()
            )

            if not session:
                return None

            session.position = max(0.0, position)

            session.last_heartbeat = datetime.now(
                timezone.utc
            )

            db.commit()

            return {
                "session_id": session_id,
                "position": session.position,
                "last_heartbeat": (
                    session.last_heartbeat.isoformat()
                ),
            }

        finally:
            db.close()

    # ==========================================================
    # PLAYBACK EVENT
    # ==========================================================

    def event(
        self,
        session_id: str,
        event_type: str,
        position: float = 0.0,
    ):
        db = SessionLocal()

        try:
            session = (
                db.query(ListenerSession)
                .filter(
                    ListenerSession.session_id == session_id
                )
                .first()
            )

            if not session:
                return None

            safe_position = max(0.0, position)

            session.position = safe_position

            session.last_heartbeat = datetime.now(
                timezone.utc
            )

            db.add(
                ListenerEvent(
                    event_type=event_type,
                    listener_id=session.listener_id,
                    session_id=session.session_id,
                    creator_id=session.creator_id,
                    show_id=session.show_id,
                    episode_id=session.episode_id,
                    position=safe_position,
                    duration=session.duration,
                )
            )

            if event_type in (
                "complete",
                "ended",
            ):
                session.ended_at = datetime.now(
                    timezone.utc
                )

            db.commit()

            return {
                "session_id": session_id,
                "event_type": event_type,
                "position": safe_position,
            }

        finally:
            db.close()

    # ==========================================================
    # CREATOR DASHBOARD
    # ==========================================================

    def dashboard(
        self,
        creator_id: str,
    ):
        db = SessionLocal()

        try:
            events = (
                db.query(ListenerEvent)
                .filter(
                    ListenerEvent.creator_id == creator_id
                )
                .all()
            )

            sessions = (
                db.query(ListenerSession)
                .filter(
                    ListenerSession.creator_id == creator_id
                )
                .all()
            )

            total_listening_seconds = sum(
                max(0.0, s.position)
                for s in sessions
            )

            return {
                "creator_id": creator_id,

                "total_plays": sum(
                    e.event_type == "play"
                    for e in events
                ),

                "unique_listeners": len(
                    {
                        s.listener_id
                        for s in sessions
                    }
                ),

                "downloads": sum(
                    e.event_type == "download"
                    for e in events
                ),

                "completions": sum(
                    e.event_type == "complete"
                    for e in events
                ),

                "listening_seconds": total_listening_seconds,
            }

        finally:
            db.close()

    # ==========================================================
    # LIVE LISTENERS
    # ==========================================================

    def live_listeners(
        self,
        creator_id: str,
        episode_id: str | None = None,
    ):
        db = SessionLocal()

        try:
            cutoff = (
                datetime.now(timezone.utc)
                - timedelta(seconds=45)
            )

            query = (
                db.query(ListenerSession)
                .filter(
                    ListenerSession.creator_id == creator_id,
                    ListenerSession.last_heartbeat >= cutoff,
                    ListenerSession.ended_at.is_(None),
                )
            )

            if episode_id:
                query = query.filter(
                    ListenerSession.episode_id == episode_id
                )

            sessions = query.all()

            return {
                "creator_id": creator_id,
                "episode_id": episode_id,
                "live_listeners": len(sessions),

                "listeners": [
                    {
                        "listener_id": s.listener_id,
                        "episode_id": s.episode_id,
                        "show_id": s.show_id,
                        "position": s.position,
                        "duration": s.duration,
                        "last_heartbeat": (
                            s.last_heartbeat.isoformat()
                            if s.last_heartbeat
                            else None
                        ),
                    }
                    for s in sessions
                ],
            }

        finally:
            db.close()


creator_analytics = CreatorAnalyticsService()