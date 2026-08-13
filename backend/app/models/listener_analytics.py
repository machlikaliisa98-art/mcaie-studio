from datetime import datetime
from sqlalchemy import DateTime, Float, Integer, String, Index
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func
from app.database.base import Base


class ListenerEvent(Base):
    __tablename__ = 'listener_events'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    event_type: Mapped[str] = mapped_column(String(30), nullable=False, index=True)
    listener_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    session_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    creator_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    show_id: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    episode_id: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    position: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    duration: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    occurred_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)


class ListenerSession(Base):
    __tablename__ = 'listener_sessions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    listener_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    creator_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    show_id: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    episode_id: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    position: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    duration: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    last_heartbeat: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


Index('ix_listener_events_creator_episode_time', ListenerEvent.creator_id, ListenerEvent.episode_id, ListenerEvent.occurred_at)
Index('ix_listener_sessions_creator_episode_heartbeat', ListenerSession.creator_id, ListenerSession.episode_id, ListenerSession.last_heartbeat)
