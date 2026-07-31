from fastapi import APIRouter

router = APIRouter(
    prefix="/studio",
    tags=["Studio"],
)


@router.get("/status")
def status():

    return {

        "recording": False,

        "streaming": False,

        "transcribing": False,

        "microphone": None,

        "sample_rate": 48000,

        "channels": 1,

    }


@router.get("/devices")
def devices():

    """
    Placeholder.

    Later this will return all
    microphones detected by MCAIE.
    """

    return {

        "default": None,

        "devices": [],

    }