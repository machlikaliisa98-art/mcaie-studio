from pathlib import Path
import os

from dotenv import load_dotenv

load_dotenv()

#
# Project Root
#

BASE_DIR = Path(__file__).resolve().parent.parent

#
# MCAIE Storage
#
# Runtime data is stored on D:
# to avoid filling the Windows drive.
#

STORAGE = Path(r"D:\MCAIE")

#
# Audio Storage
#

UPLOADS = STORAGE / "uploads"
TEMP = STORAGE / "temp"
EPISODES = STORAGE / "episodes"
PROCESSED = STORAGE / "processed"
OUTPUTS = STORAGE / "outputs"

#
# AI Platform Storage
#

PROJECTS = STORAGE / "projects"
TRANSCRIPTS = STORAGE / "transcripts"
SUMMARIES = STORAGE / "summaries"
CHAPTERS = STORAGE / "chapters"
HIGHLIGHTS = STORAGE / "highlights"
KEYWORDS = STORAGE / "keywords"
SEARCH = STORAGE / "search"
ANALYTICS = STORAGE / "analytics"
RECOMMENDATIONS = STORAGE / "recommendations"
LIVE = STORAGE / "live"

#
# System
#

REPORTS = STORAGE / "reports"
LOGS = STORAGE / "logs"

#
# Create directories
#

for folder in (

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

):
    folder.mkdir(
        parents=True,
        exist_ok=True,
    )

#
# External binaries
#

FFMPEG = os.getenv("FFMPEG", "ffmpeg")
FFPROBE = os.getenv("FFPROBE", "ffprobe")

#
# MCAIE Audio Configuration
#

SAMPLE_RATE = 48000
CHANNELS = 1
PCM_FORMAT = "pcm_s16le"

#
# Platform
#

APP_NAME = "Man Cave UG AI Studio"
ENGINE_NAME = "MCAIE"
VERSION = "2.1.0"