from __future__ import annotations

from datetime import datetime, timezone

from app.database.session import SessionLocal
from app.models.comment import Comment


class CommentService:
    """
    Persistent comment operations for FONS.

    Comments are stored in PostgreSQL and are never fabricated
    or maintained only in frontend state.
    """

    MAX_BODY_LENGTH = 5000
    MAX_AUTHOR_NAME_LENGTH = 200

    # ==========================================================
    # NORMALIZATION
    # ==========================================================

    @staticmethod
    def _clean_text(
        value: str | None,
        max_length: int,
    ) -> str:
        if value is None:
            return ""

        value = value.strip()

        if len(value) > max_length:
            value = value[:max_length]

        return value

    # ==========================================================
    # LIST COMMENTS
    # ==========================================================

    def list_episode_comments(
        self,
        episode_id: str,
    ):
        db = SessionLocal()

        try:
            comments = (
                db.query(Comment)
                .filter(
                    Comment.episode_id == episode_id,
                    Comment.deleted_at.is_(None),
                )
                .order_by(
                    Comment.created_at.asc()
                )
                .all()
            )

            return [
                self._serialize(comment)
                for comment in comments
            ]

        finally:
            db.close()

    # ==========================================================
    # CREATE COMMENT
    # ==========================================================

    def create_comment(
        self,
        *,
        episode_id: str,
        show_id: str,
        creator_id: str,
        author_type: str,
        author_id: str,
        author_name: str,
        body: str,
        parent_id: int | None = None,
    ):
        episode_id = self._clean_text(
            episode_id,
            150,
        )

        show_id = self._clean_text(
            show_id,
            150,
        )

        creator_id = self._clean_text(
            creator_id,
            100,
        )

        author_type = self._clean_text(
            author_type,
            20,
        ).lower()

        author_id = self._clean_text(
            author_id,
            150,
        )

        author_name = self._clean_text(
            author_name,
            self.MAX_AUTHOR_NAME_LENGTH,
        )

        body = self._clean_text(
            body,
            self.MAX_BODY_LENGTH,
        )

        if not episode_id:
            raise ValueError(
                "episode_id is required."
            )

        if not show_id:
            raise ValueError(
                "show_id is required."
            )

        if not creator_id:
            raise ValueError(
                "creator_id is required."
            )

        if author_type not in {
            "listener",
            "creator",
        }:
            raise ValueError(
                "author_type must be listener or creator."
            )

        if not author_id:
            raise ValueError(
                "author_id is required."
            )

        if not author_name:
            raise ValueError(
                "author_name is required."
            )

        if not body:
            raise ValueError(
                "Comment cannot be empty."
            )

        db = SessionLocal()

        try:
            parent = None

            if parent_id is not None:

                parent = db.get(
                    Comment,
                    parent_id,
                )

                if parent is None:
                    raise ValueError(
                        "Parent comment not found."
                    )

                if parent.deleted_at is not None:
                    raise ValueError(
                        "Cannot reply to a deleted comment."
                    )

                if parent.episode_id != episode_id:
                    raise ValueError(
                        "Parent comment belongs to another episode."
                    )

            comment = Comment(
                episode_id=episode_id,
                show_id=show_id,
                creator_id=creator_id,
                author_type=author_type,
                author_id=author_id,
                author_name=author_name,
                body=body,
                parent_id=parent_id,
            )

            db.add(comment)

            db.commit()
            db.refresh(comment)

            return self._serialize(
                comment
            )

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    # ==========================================================
    # DELETE COMMENT
    # ==========================================================

    def delete_comment(
        self,
        *,
        comment_id: int,
        author_type: str,
        author_id: str,
        creator_id: str | None = None,
    ):
        db = SessionLocal()

        try:
            comment = db.get(
                Comment,
                comment_id,
            )

            if comment is None:
                return None

            if comment.deleted_at is not None:
                return self._serialize(
                    comment
                )

            authorized = False

            # Creator may moderate/delete any comment
            # belonging to their creator identity.
            if (
                author_type == "creator"
                and creator_id
                and comment.creator_id == creator_id
            ):
                authorized = True

            # Original author may delete their own comment.
            elif (
                comment.author_type == author_type
                and comment.author_id == author_id
            ):
                authorized = True

            if not authorized:
                raise PermissionError(
                    "You are not authorized to delete this comment."
                )

            comment.deleted_at = (
                datetime.now(timezone.utc)
            )

            db.commit()
            db.refresh(comment)

            return self._serialize(
                comment
            )

        except Exception:
            db.rollback()
            raise

        finally:
            db.close()

    # ==========================================================
    # SERIALIZATION
    # ==========================================================

    @staticmethod
    def _serialize(
        comment: Comment,
    ):
        return {
            "id": comment.id,
            "episode_id": comment.episode_id,
            "show_id": comment.show_id,
            "creator_id": comment.creator_id,
            "author_type": comment.author_type,
            "author_id": comment.author_id,
            "author_name": comment.author_name,
            "body": comment.body,
            "parent_id": comment.parent_id,
            "created_at": (
                comment.created_at.isoformat()
                if comment.created_at
                else None
            ),
            "updated_at": (
                comment.updated_at.isoformat()
                if comment.updated_at
                else None
            ),
        }


comment_service = CommentService()