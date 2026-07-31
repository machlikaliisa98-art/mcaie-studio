from fastapi import APIRouter, HTTPException

router = APIRouter(

    prefix="/webrtc",

    tags=["WebRTC"],

)

#
# In-memory signaling store.
#
# Later this will move to Redis or another shared store.
#

offers = {}
answers = {}
ice_candidates = {}


@router.post("/offer/{session_id}")
def create_offer(

    session_id: str,

    payload: dict,

):

    offers[session_id] = payload

    return {

        "status": "stored",

    }


@router.get("/offer/{session_id}")
def get_offer(

    session_id: str,

):

    if session_id not in offers:

        raise HTTPException(

            status_code=404,

            detail="Offer not found.",

        )

    return offers[session_id]


@router.post("/answer/{session_id}")
def create_answer(

    session_id: str,

    payload: dict,

):

    answers[session_id] = payload

    return {

        "status": "stored",

    }


@router.get("/answer/{session_id}")
def get_answer(

    session_id: str,

):

    if session_id not in answers:

        raise HTTPException(

            status_code=404,

            detail="Answer not found.",

        )

    return answers[session_id]


@router.post("/ice/{session_id}")
def add_candidate(

    session_id: str,

    payload: dict,

):

    ice_candidates.setdefault(

        session_id,

        [],

    ).append(payload)

    return {

        "status": "stored",

    }


@router.get("/ice/{session_id}")
def get_candidates(

    session_id: str,

):

    return ice_candidates.get(

        session_id,

        [],

    )