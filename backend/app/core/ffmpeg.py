import subprocess
from pathlib import Path

from app.core.config import FFMPEG


def run(command):

    process = subprocess.run(
        command,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True,
    )

    if process.returncode != 0:
        raise RuntimeError(process.stderr)

    return process


def split_audio(
    input_file: str,
    output_directory: Path,
    episode_minutes: int = 30,
):

    output_directory.mkdir(
        parents=True,
        exist_ok=True,
    )

    segment_time = episode_minutes * 60

    pattern = output_directory / "episode_%03d.wav"

    command = [

        FFMPEG,

        "-y",

        "-i",
        input_file,

        "-vn",

        "-ac",
        "1",

        "-ar",
        "48000",

        "-c:a",
        "pcm_s16le",

        "-f",
        "segment",

        "-segment_time",
        str(segment_time),

        "-reset_timestamps",
        "1",

        str(pattern),

    ]

    run(command)

    return sorted(
        output_directory.glob(
            "episode_*.wav"
        )
    )