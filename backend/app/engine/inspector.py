from dataclasses import dataclass
from pathlib import Path
import subprocess
import json

from app.config import FFPROBE


@dataclass
class AudioInspection:

    duration: float

    sample_rate: int

    channels: int

    bitrate: int

    codec: str

    should_split: bool

    intro_scan_seconds: int

    target_episode_minutes: int


class AudioInspector:

    def inspect(
        self,
        audio_file: str,
    ) -> AudioInspection:

        command = [

            FFPROBE,

            "-v",
            "quiet",

            "-print_format",
            "json",

            "-show_format",

            "-show_streams",

            audio_file,

        ]

        result = subprocess.run(

            command,

            capture_output=True,

            text=True,

            check=True,

        )

        data = json.loads(result.stdout)

        stream = data["streams"][0]

        duration = float(stream["duration"])

        sample_rate = int(stream["sample_rate"])

        channels = int(stream["channels"])

        bitrate = int(stream.get("bit_rate", 0))

        codec = stream["codec_name"]

        return AudioInspection(

            duration=duration,

            sample_rate=sample_rate,

            channels=channels,

            bitrate=bitrate,

            codec=codec,

            should_split=duration > (40 * 60),

            intro_scan_seconds=min(
                300,
                int(duration),
            ),

            target_episode_minutes=30,

        )