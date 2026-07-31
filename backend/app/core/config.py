from pathlib import Path
import multiprocessing

# --------------------------------------------------
# STORAGE
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent.parent

UPLOAD_DIR = BASE_DIR / "storage" / "uploads"
EPISODE_DIR = BASE_DIR / "storage" / "episodes"
OUTPUT_DIR = BASE_DIR / "storage" / "outputs"
TEMP_DIR = BASE_DIR / "storage" / "temp"
LOG_DIR = BASE_DIR / "storage" / "logs"

for directory in (
    UPLOAD_DIR,
    EPISODE_DIR,
    OUTPUT_DIR,
    TEMP_DIR,
    LOG_DIR,
):
    directory.mkdir(parents=True, exist_ok=True)

# --------------------------------------------------
# AUDIO
# --------------------------------------------------

TARGET_SAMPLE_RATE = 48000
TARGET_CHANNELS = 1
TARGET_FORMAT = "wav"

DEFAULT_EPISODE_MINUTES = 30

# --------------------------------------------------
# PERFORMANCE
# --------------------------------------------------

MAX_WORKERS = max(
    2,
    multiprocessing.cpu_count() - 1,
)

CHUNK_SECONDS = 20

# --------------------------------------------------
# FFMPEG
# --------------------------------------------------

FFMPEG = "ffmpeg"
FFPROBE = "ffprobe"