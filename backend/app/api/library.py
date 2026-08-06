from pathlib import Path

from fastapi import APIRouter

from app.config import (
    EPISODES,
    TRANSCRIPTS,
    SUMMARIES,
    KEYWORDS,
)

router = APIRouter(
    prefix="/library",
    tags=["Library"],
)


@router.get("/")
def library():

    episodes = []

    #
    # Every processed audio becomes a card
    #

    for audio in sorted(
        EPISODES.glob("*"),
        reverse=True,
    ):

        if audio.is_dir():
            continue

        stem = audio.stem

        transcript = TRANSCRIPTS / f"{stem}.txt"
        summary = SUMMARIES / f"{stem}.txt"
        keywords = KEYWORDS / f"{stem}.json"

        episodes.append(
            {
                "id": stem,

                "title": stem.replace("_", " "),

                "audio": str(audio),

                "transcript_exists": transcript.exists(),

                "summary_exists": summary.exists(),

                "keywords_exists": keywords.exists(),

                "transcript": str(transcript)
                if transcript.exists()
                else None,

                "summary": str(summary)
                if summary.exists()
                else None,

                "keywords": str(keywords)
                if keywords.exists()
                else None,
            }
        )

    return {
        "success": True,
        "count": len(episodes),
        "episodes": episodes,
    }