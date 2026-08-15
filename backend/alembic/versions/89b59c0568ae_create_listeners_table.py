"""create listeners table

Revision ID: 89b59c0568ae
Revises: 4fff97548e15
Create Date: 2026-08-15 16:15:00
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "89b59c0568ae"

down_revision: Union[str, Sequence[str], None] = "add_comments"

branch_labels: Union[str, Sequence[str], None] = None

depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.create_table(
        "listeners",

        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),

        sa.Column(
            "full_name",
            sa.String(length=200),
            nullable=False,
        ),

        sa.Column(
            "username",
            sa.String(length=100),
            nullable=False,
        ),

        sa.Column(
            "email",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "password_hash",
            sa.String(length=255),
            nullable=False,
        ),

        sa.Column(
            "country",
            sa.String(length=120),
            nullable=False,
        ),

        sa.Column(
            "active",
            sa.Boolean(),
            nullable=False,
            server_default=sa.true(),
        ),

        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),

        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        "ix_listeners_id",
        "listeners",
        ["id"],
        unique=False,
    )

    op.create_index(
        "ix_listeners_username",
        "listeners",
        ["username"],
        unique=True,
    )

    op.create_index(
        "ix_listeners_email",
        "listeners",
        ["email"],
        unique=True,
    )


def downgrade() -> None:

    op.drop_index(
        "ix_listeners_email",
        table_name="listeners",
    )

    op.drop_index(
        "ix_listeners_username",
        table_name="listeners",
    )

    op.drop_index(
        "ix_listeners_id",
        table_name="listeners",
    )

    op.drop_table("listeners")