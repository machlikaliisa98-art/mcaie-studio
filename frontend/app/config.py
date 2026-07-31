from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parent.parent


STORAGE = ROOT / "storage"

UPLOADS = STORAGE / "uploads"

ANALYSIS = STORAGE / "analysis"

EPISODES = STORAGE / "episodes"

PROCESSED = STORAGE / "processed"

REPORTS = STORAGE / "reports"

TEMP = STORAGE / "temp"

LOGS = STORAGE / "logs"


for folder in (

    STORAGE,

    UPLOADS,

    ANALYSIS,

    EPISODES,

    PROCESSED,

    REPORTS,

    TEMP,

    LOGS,

):

    folder.mkdir(

        parents=True,

        exist_ok=True,

    )


FFMPEG = shutil.which("ffmpeg") or "ffmpeg"

FFPROBE = shutil.which("ffprobe") or "ffprobe"


ANALYSIS_SECONDS = 300

EPISODE_MINUTES = 30

ANALYSIS_SAMPLE_RATE = 16000

PRODUCTION_SAMPLE_RATE = 48000