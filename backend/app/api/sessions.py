from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.participant import Participant
from app.services.session_registry import registry


router = APIRouter(
    prefix="/sessions",
    tags=["Sessions"],
)


class CreateSessionRequest(BaseModel):
    title: str
    category: str = "General"
    host: str


class JoinSessionRequest(BaseModel):
    name: str


class SpeakerRequest(BaseModel):
    name: str


@router.post("/")
def create_session(request: CreateSessionRequest):

    session = registry.create(
        session_id=uuid4().hex,
        title=request.title,
    )

    host = Participant(
        name=request.host,
    )

    session.add_participant(host)

    return session.serialize()


@router.get("/")
def list_sessions():

    return registry.serialize()


@router.get("/{session_id}")
def get_session(session_id: str):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    return session.serialize()


@router.post("/{session_id}/start")
def start_session(session_id: str):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    session.status = "live"

    return session.serialize()


@router.post("/{session_id}/end")
def end_session(session_id: str):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    session.status = "ended"

    return session.serialize()


@router.post("/{session_id}/join")
def join_session(
    session_id: str,
    request: JoinSessionRequest,
):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    participant = Participant(
        name=request.name,
    )

    session.add_participant(participant)

    return {
        "participant": participant.serialize(),
        "session": session.serialize(),
    }


@router.post("/{session_id}/raise-hand")
def raise_hand(
    session_id: str,
    request: JoinSessionRequest,
):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    participant = next(
        (
            p
            for p in session.participants.values()
            if p.name == request.name
        ),
        None,
    )

    if participant is None:

        raise HTTPException(
            status_code=404,
            detail="Participant not found.",
        )

    session.raise_hand(
        participant.id,
    )

    return session.serialize()


@router.post("/{session_id}/speaker")
def approve_speaker(
    session_id: str,
    request: SpeakerRequest,
):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    participant = next(
        (
            p
            for p in session.participants.values()
            if p.name == request.name
        ),
        None,
    )

    if participant is None:

        raise HTTPException(
            status_code=404,
            detail="Participant not found.",
        )

    session.promote_to_stage(
        participant.id,
    )

    return session.serialize()


@router.post("/{session_id}/raise-hand/{participant_id}")
def raise_hand_by_id(
    session_id: str,
    participant_id: str,
):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    session.raise_hand(
        participant_id,
    )

    return session.serialize()


@router.post("/{session_id}/approve-speaker/{participant_id}")
def approve_speaker_by_id(
    session_id: str,
    participant_id: str,
):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    session.promote_to_stage(
        participant_id,
    )

    return session.serialize()


@router.post("/{session_id}/remove-speaker/{participant_id}")
def remove_speaker(
    session_id: str,
    participant_id: str,
):

    session = registry.get(session_id)

    if session is None:

        raise HTTPException(
            status_code=404,
            detail="Session not found.",
        )

    session.remove_from_stage(
        participant_id,
    )

    return session.serialize()