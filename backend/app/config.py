from pathlib import Path
import os

from dotenv import load_dotenv


load_dotenv()


# ==========================================================
# PROJECT ROOT
# ==========================================================

BASE_DIR = (
    Path(__file__)
    .resolve()
    .parent
    .parent
)


# ==========================================================
# MCAIE STORAGE
# ==========================================================
#
# IMPORTANT:
#
# Storage is environment-driven.
#
# LOCAL DEVELOPMENT:
#
#     STORAGE_PATH=D:\MCAIE
#
# NORTHFLANK:
#
#     STORAGE_PATH=/data/mcaie
#
# This means the application NEVER depends on
# a hard-coded Windows drive in production.
# ==========================================================

STORAGE_ENV = os.getenv(
    "STORAGE_PATH"
)


if STORAGE_ENV:

    STORAGE = Path(
        STORAGE_ENV
    ).expanduser()

else:

    # Local Windows development fallback.
    #
    # This preserves the existing local
    # D:\MCAIE workflow.

    if os.name == "nt":

        STORAGE = Path(
            r"D:\MCAIE"
        )

    else:

        # Safe Linux fallback.
        #
        # Northflank production should
        # explicitly provide STORAGE_PATH.

        STORAGE = Path(
            "/data/mcaie"
        )


# ==========================================================
# AUDIO STORAGE
# ==========================================================

UPLOADS = (
    STORAGE /
    "uploads"
)

TEMP = (
    STORAGE /
    "temp"
)

EPISODES = (
    STORAGE /
    "episodes"
)

PROCESSED = (
    STORAGE /
    "processed"
)

OUTPUTS = (
    STORAGE /
    "outputs"
)


# ==========================================================
# AI PLATFORM STORAGE
# ==========================================================

PROJECTS = (
    STORAGE /
    "projects"
)

TRANSCRIPTS = (
    STORAGE /
    "transcripts"
)

SUMMARIES = (
    STORAGE /
    "summaries"
)

CHAPTERS = (
    STORAGE /
    "chapters"
)

HIGHLIGHTS = (
    STORAGE /
    "highlights"
)

KEYWORDS = (
    STORAGE /
    "keywords"
)

SEARCH = (
    STORAGE /
    "search"
)

ANALYTICS = (
    STORAGE /
    "analytics"
)

RECOMMENDATIONS = (
    STORAGE /
    "recommendations"
)

LIVE = (
    STORAGE /
    "live"
)


# ==========================================================
# SYSTEM
# ==========================================================

REPORTS = (
    STORAGE /
    "reports"
)

LOGS = (
    STORAGE /
    "logs"
)


# ==========================================================
# CREATE DIRECTORIES
# ==========================================================

DIRECTORIES = (

    STORAGE,

    UPLOADS,

    TEMP,

    EPISODES,

    PROCESSED,

    OUTPUTS,

    PROJECTS,

    TRANSCRIPTS,

    SUMMARIES,

    CHAPTERS,

    HIGHLIGHTS,

    KEYWORDS,

    SEARCH,

    ANALYTICS,

    RECOMMENDATIONS,

    LIVE,

    REPORTS,

    LOGS,

)


for folder in DIRECTORIES:

    folder.mkdir(
        parents=True,
        exist_ok=True,
    )


# ==========================================================
# EXTERNAL BINARIES
# ==========================================================

FFMPEG = os.getenv(
    "FFMPEG",
    "ffmpeg",
)

FFPROBE = os.getenv(
    "FFPROBE",
    "ffprobe",
)


# ==========================================================
# MCAIE AUDIO CONFIGURATION
# ==========================================================

SAMPLE_RATE = 48000

CHANNELS = 1

PCM_FORMAT = (
    "pcm_s16le"
)


# ==========================================================
# PLATFORM
# ==========================================================

APP_NAME = (
    "Man Cave UG AI Studio"
)

ENGINE_NAME = "MCAIE"

VERSION = "2.1.0"