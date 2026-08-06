from pathlib import Path
import json

from fastapi import APIRouter, HTTPException

from app.config import OUTPUTS


router = APIRouter(

    prefix="/shows",

    tags=["Shows"],

)

SHOWS = OUTPUTS / "shows"


@router.get("/")

def get_shows():

    shows = []

    if not SHOWS.exists():

        return shows

    for folder in sorted(

        SHOWS.iterdir()

    ):

        if folder.is_dir():

            shows.append(

                {

                    "id": folder.name,

                    "title": folder.name.replace("-", " ").title(),

                }

            )

    return shows


@router.get("/{show}")

def get_show(

    show: str,

):

    folder = SHOWS / show

    if not folder.exists():

        raise HTTPException(

            status_code=404,

            detail="Show not found.",

        )

    episodes = []

    for file in sorted(

        folder.glob("*.json"),

        reverse=True,

    ):

        with open(

            file,

            encoding="utf-8",

        ) as f:

            episodes.append(

                json.load(f)

            )

    return episodes


@router.get("/{show}/{episode}")

def get_episode(

    show: str,

    episode: str,

):

    file = (

        SHOWS /

        show /

        f"{episode}.json"

    )

    if not file.exists():

        raise HTTPException(

            status_code=404,

            detail="Episode not found.",

        )

    with open(

        file,

        encoding="utf-8",

    ) as f:

        return json.load(f)