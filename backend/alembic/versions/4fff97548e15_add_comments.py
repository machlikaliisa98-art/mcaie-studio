"""add comments

Revision ID: add_comments
Revises: 08e61e99db94
Create Date: 2026-08-14
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "add_comments"

down_revision: Union[
    str,
    Sequence[str],
    None,
] = "08e61e99db94"

branch_labels: Union[
    str,
    Sequence[str],
    None,
] = None

depends_on: Union[
    str,
    Sequence[str],
    None,
] = None


def upgrade() -> None:

    op.create_table(
        "comments",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "episode_id",
            sa.String(length=150),
            nullable=False,
        ),

        sa.Column(
            "show_id",
            sa.String(length=150),
            nullable=False,
        ),

        sa.Column(
            "creator_id",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "author_type",
            sa.String(length=20),
            nullable=False,
        ),

        sa.Column(
            "author_id",
            sa.String(length=150),
            nullable=False,
        ),

        sa.Column(
            "author_name",
            sa.String(length=200),
            nullable=False,
        ),

        sa.Column(
            "body",
            sa.String(length=5000),
            nullable=False,
        ),

        sa.Column(
            "parent_id",
            sa.Integer(),
            nullable=True,
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),

        sa.Column(
            "deleted_at",
            sa.DateTime(timezone=True),
            nullable=True,
        ),

        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_comments_id",
        "comments",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_comments_episode_id",
        "comments",
        ["episode_id"],
        unique=False,
    )

    op.create_index(
        "ix_comments_show_id",
        "comments",
        ["show_id"],
        unique=False,
    )

    op.create_index(
        "ix_comments_creator_id",
        "comments",
        ["creator_id"],
        unique=False,
    )

    op.create_index(
        "ix_comments_author_type",
        "comments",
        ["author_type"],
        unique=False,
    )

    op.create_index(
        "ix_comments_author_id",
        "comments",
        ["author_id"],
        unique=False,
    )

    op.create_index(
        "ix_comments_parent_id",
        "comments",
        ["parent_id"],
        unique=False,
    )

    op.create_index(
        "ix_comments_created_at",
        "comments",
        ["created_at"],
        unique=False,
    )

    op.create_index(
        "ix_comments_episode_created",
        "comments",
        ["episode_id", "created_at"],
        unique=False,
    )

    op.create_index(
        "ix_comments_creator_episode",
        "comments",
        ["creator_id", "episode_id"],
        unique=False,
    )

    op.create_index(
        "ix_comments_parent_created",
        "comments",
        ["parent_id", "created_at"],
        unique=False,
    )


def downgrade() -> None:

    op.drop_index(
        "ix_comments_parent_created",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_creator_episode",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_episode_created",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_created_at",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_parent_id",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_author_id",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_author_type",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_creator_id",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_show_id",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_episode_id",
        table_name="comments",
    )

    op.drop_index(
        "ix_comments_id",
        table_name="comments",
    )

    op.drop_table("comments")