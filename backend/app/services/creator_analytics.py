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
        """
        Return the creator's real analytics dashboard.

        All metrics are derived from persisted listener events
        and listener sessions. No values are fabricated.
        """

        db = SessionLocal()

        try:
            events = (
                db.query(ListenerEvent)
                .filter(
                    ListenerEvent.creator_id == creator_id
                )
                .order_by(
                    ListenerEvent.occurred_at.asc()
                )
                .all()
            )

            sessions = (
                db.query(ListenerSession)
                .filter(
                    ListenerSession.creator_id == creator_id
                )
                .order_by(
                    ListenerSession.started_at.asc()
                )
                .all()
            )

            # --------------------------------------------------
            # CORE TOTALS
            # --------------------------------------------------

            play_events = [
                e for e in events
                if e.event_type == "play"
            ]

            completion_events = [
                e for e in events
                if e.event_type == "complete"
            ]

            download_events = [
                e for e in events
                if e.event_type == "download"
            ]

            unique_listeners = {
                e.listener_id
                for e in events
                if e.listener_id
            }

            session_listeners = {
                s.listener_id
                for s in sessions
                if s.listener_id
            }

            unique_listeners.update(session_listeners)

            total_listening_seconds = sum(
                max(0.0, float(s.position or 0.0))
                for s in sessions
            )

            completion_rate = (
                round(
                    (len(completion_events) / len(play_events)) * 100,
                    1,
                )
                if play_events
                else 0.0
            )

            # --------------------------------------------------
            # LAST 30 DAYS
            # --------------------------------------------------

            now = datetime.now(timezone.utc)
            thirty_days_ago = now - timedelta(days=30)

            recent_events = [
                e for e in events
                if e.occurred_at
                and e.occurred_at >= thirty_days_ago
            ]

            # --------------------------------------------------
            # DAILY ACTIVITY
            # --------------------------------------------------

            daily = {}

            for event in recent_events:

                if event.occurred_at is None:
                    continue

                day = event.occurred_at.date().isoformat()

                if day not in daily:
                    daily[day] = {
                        "date": day,
                        "plays": 0,
                        "listeners": set(),
                        "completions": 0,
                        "downloads": 0,
                    }

                if event.event_type == "play":
                    daily[day]["plays"] += 1

                if event.listener_id:
                    daily[day]["listeners"].add(
                        event.listener_id
                    )

                if event.event_type == "complete":
                    daily[day]["completions"] += 1

                if event.event_type == "download":
                    daily[day]["downloads"] += 1

            activity = []

            for day in sorted(daily.keys()):
                item = daily[day]

                activity.append(
                    {
                        "date": item["date"],
                        "plays": item["plays"],
                        "unique_listeners": len(
                            item["listeners"]
                        ),
                        "completions": item["completions"],
                        "downloads": item["downloads"],
                    }
                )

            # --------------------------------------------------
            # SHOW PERFORMANCE
            # --------------------------------------------------

            show_data = {}

            for event in events:

                show_id = event.show_id or "unknown"

                if show_id not in show_data:
                    show_data[show_id] = {
                        "show_id": show_id,
                        "plays": 0,
                        "listeners": set(),
                        "completions": 0,
                        "downloads": 0,
                    }

                item = show_data[show_id]

                if event.event_type == "play":
                    item["plays"] += 1

                if event.listener_id:
                    item["listeners"].add(
                        event.listener_id
                    )

                if event.event_type == "complete":
                    item["completions"] += 1

                if event.event_type == "download":
                    item["downloads"] += 1

            shows = []

            for item in show_data.values():

                shows.append(
                    {
                        "show_id": item["show_id"],
                        "plays": item["plays"],
                        "unique_listeners": len(
                            item["listeners"]
                        ),
                        "completions": item["completions"],
                        "downloads": item["downloads"],
                    }
                )

            shows.sort(
                key=lambda x: x["plays"],
                reverse=True,
            )

            # --------------------------------------------------
            # EPISODE PERFORMANCE
            # --------------------------------------------------

            episode_data = {}

            for event in events:

                episode_id = event.episode_id or "unknown"

                if episode_id not in episode_data:
                    episode_data[episode_id] = {
                        "episode_id": episode_id,
                        "show_id": event.show_id,
                        "plays": 0,
                        "listeners": set(),
                        "completions": 0,
                        "downloads": 0,
                    }

                item = episode_data[episode_id]

                if event.event_type == "play":
                    item["plays"] += 1

                if event.listener_id:
                    item["listeners"].add(
                        event.listener_id
                    )

                if event.event_type == "complete":
                    item["completions"] += 1

                if event.event_type == "download":
                    item["downloads"] += 1

            episodes = []

            for item in episode_data.values():

                episodes.append(
                    {
                        "episode_id": item["episode_id"],
                        "show_id": item["show_id"],
                        "plays": item["plays"],
                        "unique_listeners": len(
                            item["listeners"]
                        ),
                        "completions": item["completions"],
                        "downloads": item["downloads"],
                    }
                )

            episodes.sort(
                key=lambda x: x["plays"],
                reverse=True,
            )

            # --------------------------------------------------
            # RECENT ACTIVITY
            # --------------------------------------------------

            recent_activity = []

            for event in reversed(events[-25:]):

                recent_activity.append(
                    {
                        "event_type": event.event_type,
                        "listener_id": event.listener_id,
                        "show_id": event.show_id,
                        "episode_id": event.episode_id,
                        "position": event.position,
                        "duration": event.duration,
                        "occurred_at": (
                            event.occurred_at.isoformat()
                            if event.occurred_at
                            else None
                        ),
                    }
                )

            # --------------------------------------------------
            # RETURN
            # --------------------------------------------------

            return {
                "creator_id": creator_id,

                "total_plays": len(play_events),

                "unique_listeners": len(
                    unique_listeners
                ),

                "downloads": len(download_events),

                "completions": len(
                    completion_events
                ),

                "listening_seconds": (
                    total_listening_seconds
                ),

                "completion_rate": completion_rate,

                "period": {
                    "days": 30,
                    "from": thirty_days_ago.isoformat(),
                    "to": now.isoformat(),
                },

                "activity": activity,

                "shows": shows,

                "episodes": episodes,

                "recent_activity": recent_activity,
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