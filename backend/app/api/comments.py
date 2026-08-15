from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.dependencies.auth import get_current_creator
from app.models.creator import Creator
from app.services.comments import comment_service


router = APIRouter(
    prefix="/comments",
    tags=["Comments"],
)


# ==========================================================
# REQUEST MODELS
# ==========================================================


class CreateListenerCommentRequest(BaseModel):
    episode_id: str
    show_id: str
    creator_id: str

    listener_id: str
    author_name: str

    body: str

    parent_id: int | None = None


class CreateCreatorCommentRequest(BaseModel):
    episode_id: str
    show_id: str

    body: str

    parent_id: int | None = None


# ==========================================================
# PUBLIC COMMENTS
# ==========================================================


@router.get(
    "/episode/{episode_id}"
)
def list_episode_comments(
    episode_id: str,
):
    """
    Return active comments for an episode.

    Reading comments is public.
    """

    return {
        "episode_id": episode_id,
        "comments": comment_service.list_episode_comments(
            episode_id
        ),
    }


# ==========================================================
# LISTENER COMMENT
# ==========================================================


@router.post(
    "/episode"
)
def create_listener_comment(
    request: CreateListenerCommentRequest,
):
    """
    Create a listener comment.

    Listener identity is supplied by the playback client.

    The listener is intentionally not treated as a creator.
    """

    try:

        comment = comment_service.create_comment(
            episode_id=request.episode_id,
            show_id=request.show_id,
            creator_id=request.creator_id,
            author_type="listener",
            author_id=request.listener_id,
            author_name=request.author_name,
            body=request.body,
            parent_id=request.parent_id,
        )

        return {
            "success": True,
            "comment": comment,
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


# ==========================================================
# CREATOR COMMENT / REPLY
# ==========================================================


@router.post(
    "/creator"
)
def create_creator_comment(
    request: CreateCreatorCommentRequest,
    creator: Creator = Depends(
        get_current_creator
    ),
):
    """
    Create a verified creator comment or reply.

    The creator identity is taken exclusively from
    the authenticated JWT.

    The client cannot impersonate another creator.
    """

    try:

        comment = comment_service.create_comment(
            episode_id=request.episode_id,
            show_id=request.show_id,
            creator_id=creator.username,
            author_type="creator",
            author_id=creator.username,
            author_name=creator.full_name,
            body=request.body,
            parent_id=request.parent_id,
        )

        return {
            "success": True,
            "comment": comment,
        }

    except ValueError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error),
        )


# ==========================================================
# CREATOR MODERATION
# ==========================================================


@router.delete(
    "/creator/{comment_id}"
)
def creator_delete_comment(
    comment_id: int,
    creator: Creator = Depends(
        get_current_creator
    ),
):
    """
    Allow an authenticated creator to moderate
    comments belonging to their own creator identity.
    """

    try:

        result = comment_service.delete_comment(
            comment_id=comment_id,
            author_type="creator",
            author_id=creator.username,
            creator_id=creator.username,
        )

        if result is None:

            raise HTTPException(
                status_code=404,
                detail="Comment not found.",
            )

        return {
            "success": True,
            "comment": result,
        }

    except PermissionError as error:

        raise HTTPException(
            status_code=403,
            detail=str(error),
        )


# ==========================================================
# LISTENER DELETE
# ==========================================================


@router.delete(
    "/listener/{comment_id}"
)
def listener_delete_comment(
    comment_id: int,
    listener_id: str,
):
    """
    Allow the original listener author to remove
    their own comment.

    The current FONS listener system uses listener IDs
    rather than authenticated listener accounts.
    """

    try:

        result = comment_service.delete_comment(
            comment_id=comment_id,
            author_type="listener",
            author_id=listener_id,
        )

        if result is None:

            raise HTTPException(
                status_code=404,
                detail="Comment not found.",
            )

        return {
            "success": True,
            "comment": result,
        }

    except PermissionError as error:

        raise HTTPException(
            status_code=403,
            detail=str(error),
        )