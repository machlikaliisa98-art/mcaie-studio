from collections import defaultdict
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
                duration=max(0.0, duration),
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
                    duration=max(0.0, duration),
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

            session.position = max(
                0.0,
                float(position),
            )

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

            safe_position = max(
                0.0,
                float(position),
            )

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
                    duration=max(
                        0.0,
                        float(session.duration or 0.0),
                    ),
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
        Return real creator intelligence derived entirely
        from persisted listener events and sessions.

        No analytics values are fabricated.

        The response is intentionally show-aware so that
        Kyamagero Daily, Man Cave UG, and future shows
        can use the same analytics engine.
        """

        db = SessionLocal()

        try:

            # ==================================================
            # LOAD DATA
            # ==================================================

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

            # ==================================================
            # CORE EVENT GROUPS
            # ==================================================

            play_events = [
                event
                for event in events
                if event.event_type == "play"
            ]

            completion_events = [
                event
                for event in events
                if event.event_type == "complete"
            ]

            download_events = [
                event
                for event in events
                if event.event_type == "download"
            ]

            # ==================================================
            # UNIQUE AUDIENCE
            # ==================================================

            unique_listeners = {
                event.listener_id
                for event in events
                if event.listener_id
            }

            session_listeners = {
                session.listener_id
                for session in sessions
                if session.listener_id
            }

            unique_listeners.update(
                session_listeners
            )

            # ==================================================
            # SESSION LISTENING DEPTH
            # ==================================================

            session_depth = {}

            for session in sessions:

                duration = max(
                    0.0,
                    float(
                        session.duration or 0.0
                    ),
                )

                position = max(
                    0.0,
                    float(
                        session.position or 0.0
                    ),
                )

                session_depth[
                    session.session_id
                ] = {
                    "position": min(
                        position,
                        duration
                    )
                    if duration > 0
                    else position,
                    "duration": duration,
                }

            total_listening_seconds = sum(
                item["position"]
                for item in session_depth.values()
            )

            total_session_duration = sum(
                item["duration"]
                for item in session_depth.values()
                if item["duration"] > 0
            )

            average_session_seconds = (
                total_listening_seconds
                / len(session_depth)
                if session_depth
                else 0.0
            )

            average_listening_depth = (
                (
                    total_listening_seconds
                    / total_session_duration
                )
                * 100
                if total_session_duration > 0
                else 0.0
            )

            # ==================================================
            # COMPLETION RATE
            # ==================================================

            completion_rate = (
                (
                    len(completion_events)
                    / len(play_events)
                )
                * 100
                if play_events
                else 0.0
            )

            # ==================================================
            # 30-DAY WINDOW
            # ==================================================

            now = datetime.now(timezone.utc)

            thirty_days_ago = (
                now - timedelta(days=30)
            )

            recent_events = [
                event
                for event in events
                if (
                    event.occurred_at
                    and event.occurred_at
                    >= thirty_days_ago
                )
            ]

            recent_sessions = [
                session
                for session in sessions
                if (
                    session.started_at
                    and session.started_at
                    >= thirty_days_ago
                )
            ]

            # ==================================================
            # DAILY ACTIVITY
            # ==================================================

            daily = {}

            for event in recent_events:

                if not event.occurred_at:
                    continue

                day = (
                    event.occurred_at
                    .date()
                    .isoformat()
                )

                if day not in daily:
                    daily[day] = {
                        "date": day,
                        "plays": 0,
                        "listeners": set(),
                        "completions": 0,
                        "downloads": 0,
                    }

                item = daily[day]

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
                        "completions": item[
                            "completions"
                        ],
                        "downloads": item[
                            "downloads"
                        ],
                    }
                )

            # ==================================================
            # AUDIENCE LOYALTY
            # ==================================================
            #
            # A listener with more than one recorded play
            # is considered returning.
            #
            # This is based entirely on real listener IDs.
            # ==================================================

            plays_by_listener = defaultdict(int)

            for event in play_events:

                if event.listener_id:
                    plays_by_listener[
                        event.listener_id
                    ] += 1

            returning_listeners = {
                listener_id
                for listener_id, count
                in plays_by_listener.items()
                if count > 1
            }

            new_listeners = {
                listener_id
                for listener_id, count
                in plays_by_listener.items()
                if count == 1
            }

            total_play_listeners = len(
                plays_by_listener
            )

            returning_listener_rate = (
                (
                    len(returning_listeners)
                    / total_play_listeners
                )
                * 100
                if total_play_listeners
                else 0.0
            )

            new_listener_rate = (
                (
                    len(new_listeners)
                    / total_play_listeners
                )
                * 100
                if total_play_listeners
                else 0.0
            )

            # ==================================================
            # REPEAT PLAYS
            # ==================================================

            repeat_plays = sum(
                max(
                    0,
                    count - 1,
                )
                for count
                in plays_by_listener.values()
            )

            # ==================================================
            # LISTENING BY HOUR
            # ==================================================

            hourly_activity = [
                {
                    "hour": hour,
                    "plays": 0,
                    "listeners": set(),
                }
                for hour in range(24)
            ]

            for event in recent_events:

                if not event.occurred_at:
                    continue

                hour = (
                    event.occurred_at.hour
                )

                if event.event_type == "play":
                    hourly_activity[hour][
                        "plays"
                    ] += 1

                if event.listener_id:
                    hourly_activity[hour][
                        "listeners"
                    ].add(
                        event.listener_id
                    )

            listening_by_hour = [
                {
                    "hour": item["hour"],
                    "plays": item["plays"],
                    "unique_listeners": len(
                        item["listeners"]
                    ),
                }
                for item in hourly_activity
            ]

            # ==================================================
            # LISTENING BY DAY OF WEEK
            # ==================================================

            weekday_names = [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ]

            weekday_activity = [
                {
                    "day": name,
                    "day_number": index,
                    "plays": 0,
                    "listeners": set(),
                }
                for index, name
                in enumerate(weekday_names)
            ]

            for event in recent_events:

                if not event.occurred_at:
                    continue

                day_number = (
                    event.occurred_at.weekday()
                )

                if event.event_type == "play":
                    weekday_activity[
                        day_number
                    ]["plays"] += 1

                if event.listener_id:
                    weekday_activity[
                        day_number
                    ]["listeners"].add(
                        event.listener_id
                    )

            listening_by_day = [
                {
                    "day": item["day"],
                    "day_number": item[
                        "day_number"
                    ],
                    "plays": item["plays"],
                    "unique_listeners": len(
                        item["listeners"]
                    ),
                }
                for item in weekday_activity
            ]

            # ==================================================
            # RETENTION / ATTENTION
            # ==================================================
            #
            # We calculate retention from the furthest real
            # playback position recorded for each session.
            #
            # This avoids pretending we know what a listener
            # heard when no playback position was persisted.
            # ==================================================

            retention_buckets = {
                "0": 0,
                "25": 0,
                "50": 0,
                "75": 0,
                "100": 0,
            }

            retention_sessions = 0

            for session in sessions:

                duration = max(
                    0.0,
                    float(
                        session.duration or 0.0
                    ),
                )

                if duration <= 0:
                    continue

                position = min(
                    max(
                        0.0,
                        float(
                            session.position or 0.0
                        ),
                    ),
                    duration,
                )

                progress = (
                    position / duration
                ) * 100

                retention_sessions += 1

                if progress >= 25:
                    retention_buckets[
                        "25"
                    ] += 1

                if progress >= 50:
                    retention_buckets[
                        "50"
                    ] += 1

                if progress >= 75:
                    retention_buckets[
                        "75"
                    ] += 1

                if progress >= 95:
                    retention_buckets[
                        "100"
                    ] += 1

            retention = []

            for percentage in (
                0,
                25,
                50,
                75,
                100,
            ):

                if percentage == 0:
                    rate = (
                        100.0
                        if retention_sessions
                        else 0.0
                    )
                else:
                    rate = (
                        (
                            retention_buckets[
                                str(percentage)
                            ]
                            / retention_sessions
                        )
                        * 100
                        if retention_sessions
                        else 0.0
                    )

                retention.append(
                    {
                        "percentage": percentage,
                        "listeners": (
                            retention_sessions
                            if percentage == 0
                            else retention_buckets[
                                str(percentage)
                            ]
                        ),
                        "rate": round(
                            rate,
                            1,
                        ),
                    }
                )

            # ==================================================
            # SHOW PERFORMANCE
            # ==================================================

            show_data = {}

            for event in events:

                show_id = (
                    event.show_id
                    or "unknown"
                )

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

                show_completion_rate = (
                    (
                        item["completions"]
                        / item["plays"]
                    )
                    * 100
                    if item["plays"]
                    else 0.0
                )

                shows.append(
                    {
                        "show_id": item[
                            "show_id"
                        ],
                        "plays": item["plays"],
                        "unique_listeners": len(
                            item["listeners"]
                        ),
                        "completions": item[
                            "completions"
                        ],
                        "downloads": item[
                            "downloads"
                        ],
                        "completion_rate": round(
                            show_completion_rate,
                            1,
                        ),
                    }
                )

            shows.sort(
                key=lambda item: item[
                    "plays"
                ],
                reverse=True,
            )

            # ==================================================
            # EPISODE PERFORMANCE
            # ==================================================
            #
            # IMPORTANT:
            # Key is show_id + episode_id.
            #
            # This prevents:
            #
            # Kyamagero Daily / 001
            #
            # from colliding with:
            #
            # Man Cave UG / 001
            # ==================================================

            episode_data = {}

            for event in events:

                show_id = (
                    event.show_id
                    or "unknown"
                )

                episode_id = (
                    event.episode_id
                    or "unknown"
                )

                key = (
                    show_id,
                    episode_id,
                )

                if key not in episode_data:
                    episode_data[key] = {
                        "episode_id": episode_id,
                        "show_id": show_id,
                        "plays": 0,
                        "listeners": set(),
                        "completions": 0,
                        "downloads": 0,
                    }

                item = episode_data[key]

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

                episode_completion_rate = (
                    (
                        item["completions"]
                        / item["plays"]
                    )
                    * 100
                    if item["plays"]
                    else 0.0
                )

                episodes.append(
                    {
                        "episode_id": item[
                            "episode_id"
                        ],
                        "show_id": item[
                            "show_id"
                        ],
                        "plays": item["plays"],
                        "unique_listeners": len(
                            item["listeners"]
                        ),
                        "completions": item[
                            "completions"
                        ],
                        "downloads": item[
                            "downloads"
                        ],
                        "completion_rate": round(
                            episode_completion_rate,
                            1,
                        ),
                    }
                )

            episodes.sort(
                key=lambda item: item[
                    "plays"
                ],
                reverse=True,
            )

            # ==================================================
            # RECENT ACTIVITY
            # ==================================================

            recent_activity = []

            for event in reversed(
                events[-25:]
            ):

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

            # ==================================================
            # LISTENER JOURNEY
            # ==================================================
            #
            # We only count a journey when the database has
            # enough actual evidence.
            #
            # A listener who has played more than one episode
            # has demonstrably explored the catalogue.
            # ==================================================

            episodes_per_listener = defaultdict(
                set
            )

            for event in play_events:

                if (
                    event.listener_id
                    and event.show_id
                    and event.episode_id
                ):
                    episodes_per_listener[
                        event.listener_id
                    ].add(
                        (
                            event.show_id,
                            event.episode_id,
                        )
                    )

            catalogue_explorers = {
                listener_id
                for listener_id, episode_set
                in episodes_per_listener.items()
                if len(episode_set) > 1
            }

            catalogue_exploration_rate = (
                (
                    len(catalogue_explorers)
                    / total_play_listeners
                )
                * 100
                if total_play_listeners
                else 0.0
            )

            # ==================================================
            # TOP LISTENING HOUR
            # ==================================================

            top_hour = None

            if listening_by_hour:
                top_hour = max(
                    listening_by_hour,
                    key=lambda item: item[
                        "plays"
                    ],
                )

                if top_hour["plays"] == 0:
                    top_hour = None

            # ==================================================
            # TOP LISTENING DAY
            # ==================================================

            top_day = None

            if listening_by_day:
                top_day = max(
                    listening_by_day,
                    key=lambda item: item[
                        "plays"
                    ],
                )

                if top_day["plays"] == 0:
                    top_day = None

            # ==================================================
            # RETURN
            # ==================================================

            return {
                # ------------------------------------------------
                # IDENTITY
                # ------------------------------------------------

                "creator_id": creator_id,

                # ------------------------------------------------
                # CORE
                # ------------------------------------------------

                "total_plays": len(
                    play_events
                ),

                "unique_listeners": len(
                    unique_listeners
                ),

                "downloads": len(
                    download_events
                ),

                "completions": len(
                    completion_events
                ),

                "listening_seconds": (
                    total_listening_seconds
                ),

                "completion_rate": round(
                    completion_rate,
                    1,
                ),

                # ------------------------------------------------
                # AUDIENCE LOYALTY
                # ------------------------------------------------

                "audience": {
                    "total_listeners": len(
                        unique_listeners
                    ),
                    "play_listeners": (
                        total_play_listeners
                    ),
                    "new_listeners": len(
                        new_listeners
                    ),
                    "returning_listeners": len(
                        returning_listeners
                    ),
                    "new_listener_rate": round(
                        new_listener_rate,
                        1,
                    ),
                    "returning_listener_rate": round(
                        returning_listener_rate,
                        1,
                    ),
                    "repeat_plays": repeat_plays,
                },

                # ------------------------------------------------
                # LISTENING BEHAVIOUR
                # ------------------------------------------------

                "listening": {
                    "total_seconds": (
                        total_listening_seconds
                    ),
                    "average_session_seconds": round(
                        average_session_seconds,
                        1,
                    ),
                    "average_listening_depth": round(
                        average_listening_depth,
                        1,
                    ),
                    "retention_sessions": (
                        retention_sessions
                    ),
                    "retention": retention,
                },

                # ------------------------------------------------
                # DISCOVERY / CATALOGUE BEHAVIOUR
                # ------------------------------------------------

                "discovery": {
                    "catalogue_explorers": len(
                        catalogue_explorers
                    ),
                    "catalogue_exploration_rate": round(
                        catalogue_exploration_rate,
                        1,
                    ),
                },

                # ------------------------------------------------
                # TIME BEHAVIOUR
                # ------------------------------------------------

                "time_behaviour": {
                    "by_hour": listening_by_hour,
                    "by_day": listening_by_day,
                    "top_hour": top_hour,
                    "top_day": top_day,
                },

                # ------------------------------------------------
                # PERIOD
                # ------------------------------------------------

                "period": {
                    "days": 30,
                    "from": (
                        thirty_days_ago.isoformat()
                    ),
                    "to": now.isoformat(),
                },

                # ------------------------------------------------
                # DAILY ACTIVITY
                # ------------------------------------------------

                "activity": activity,

                # ------------------------------------------------
                # SHOWS
                # ------------------------------------------------

                "shows": shows,

                # ------------------------------------------------
                # EPISODES
                # ------------------------------------------------

                "episodes": episodes,

                # ------------------------------------------------
                # RECENT ACTIVITY
                # ------------------------------------------------

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
                    ListenerSession.creator_id
                    == creator_id,

                    ListenerSession.last_heartbeat
                    >= cutoff,

                    ListenerSession.ended_at.is_(
                        None
                    ),
                )
            )

            if episode_id:

                query = query.filter(
                    ListenerSession.episode_id
                    == episode_id
                )

            sessions = query.all()

            return {
                "creator_id": creator_id,

                "episode_id": episode_id,

                "live_listeners": len(
                    sessions
                ),

                "listeners": [
                    {
                        "listener_id": (
                            session.listener_id
                        ),
                        "episode_id": (
                            session.episode_id
                        ),
                        "show_id": (
                            session.show_id
                        ),
                        "position": (
                            session.position
                        ),
                        "duration": (
                            session.duration
                        ),
                        "last_heartbeat": (
                            session.last_heartbeat.isoformat()
                            if session.last_heartbeat
                            else None
                        ),
                    }
                    for session in sessions
                ],
            }

        finally:
            db.close()


creator_analytics = (
    CreatorAnalyticsService()
)