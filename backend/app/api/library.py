from fastapi import APIRouter, HTTPException

from app.services.library import library

router = APIRouter(

    prefix="/library",

    tags=["Library"],

)


@router.get("/")

def get_library():

    return library.all()


@router.get("/latest")

def latest(

    limit: int = 10,

):

    return library.latest(limit)


@router.get("/{episode}")

def get_episode(

    episode: str,

):

    result = library.get(episode)

    if result is None:

        raise HTTPException(

            status_code=404,

            detail="Episode not found.",

        )

    return result