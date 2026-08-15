from __future__ import annotations

from datetime import datetime

from sqlalchemy import DateTime
from sqlalchemy import Index
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.database.base import Base


class Comment(Base):
    """
    Persistent listener/creator comment attached to a published episode.

    Comments deliberately reference episode/show/creator identifiers as
    strings because FONS currently represents Episode and Show as
    application-level dataclasses rather than SQLAlchemy tables.

    A comment may optionally have a parent comment, allowing replies.
    """

    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    episode_id: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    show_id: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    creator_id: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        index=True,
    )

    # "listener" or "creator"
    author_type: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        index=True,
    )

    # Listener UUID or creator username.
    author_id: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
        index=True,
    )

    author_name: Mapped[str] = mapped_column(
        String(200),
        nullable=False,
    )

    body: Mapped[str] = mapped_column(
        String(5000),
        nullable=False,
    )

    # Null means this is a top-level comment.
    # Otherwise it is a reply to another comment.
    parent_id: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True,
        index=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
        index=True,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    deleted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )


Index(
    "ix_comments_episode_created",
    Comment.episode_id,
    Comment.created_at,
)

Index(
    "ix_comments_creator_episode",
    Comment.creator_id,
    Comment.episode_id,
)

Index(
    "ix_comments_parent_created",
    Comment.parent_id,
    Comment.created_at,
)