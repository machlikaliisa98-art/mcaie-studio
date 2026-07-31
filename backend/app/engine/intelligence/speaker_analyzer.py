from dataclasses import dataclass
from pathlib import Path
import subprocess
import json
import wave
import math

from app.config import FFMPEG


@dataclass
class SpeakerProfile:

    duration: float

    sample_rate: int

    channels: int

    rms: float

    peak: float

    dynamic_range: float

    estimated_noise: str

    estimated_room: str

    estimated_microphone: str

    clarity_score: float

    warmth_score: float


class SpeakerAnalyzer:

    def analyze(

        self,

        audio_file: str,

    ) -> SpeakerProfile:

        with wave.open(audio_file, "rb") as wav:

            frames = wav.getnframes()

            rate = wav.getframerate()

            channels = wav.getnchannels()

            duration = frames / float(rate)

        probe = subprocess.run(

            [

                FFMPEG,

                "-i",

                audio_file,

                "-af",

                "volumedetect",

                "-f",

                "null",

                "-",

            ],

            capture_output=True,

            text=True,

        )

        stderr = probe.stderr

        mean_volume = -25.0

        max_volume = -3.0

        for line in stderr.splitlines():

            if "mean_volume:" in line:

                mean_volume = float(

                    line.split(":")[-1]

                    .replace(" dB", "")

                    .strip()

                )

            if "max_volume:" in line:

                max_volume = float(

                    line.split(":")[-1]

                    .replace(" dB", "")

                    .strip()

                )

        dynamic = max_volume - mean_volume

        clarity = max(

            0.0,

            min(

                1.0,

                (mean_volume + 40) / 30,

            ),

        )

        warmth = max(

            0.0,

            min(

                1.0,

                1 - abs(mean_volume + 18) / 20,

            ),

        )

        if mean_volume < -32:

            noise = "high"

        elif mean_volume < -25:

            noise = "medium"

        else:

            noise = "low"

        if dynamic < 12:

            room = "large"

        elif dynamic < 18:

            room = "medium"

        else:

            room = "treated"

        if clarity > 0.8:

            microphone = "broadcast"

        elif clarity > 0.6:

            microphone = "consumer"

        else:

            microphone = "phone"

        return SpeakerProfile(

            duration=duration,

            sample_rate=rate,

            channels=channels,

            rms=mean_volume,

            peak=max_volume,

            dynamic_range=dynamic,

            estimated_noise=noise,

            estimated_room=room,

            estimated_microphone=microphone,

            clarity_score=clarity,

            warmth_score=warmth,

        )

    def export(

        self,

        profile: SpeakerProfile,

        output: Path,

    ):

        output.write_text(

            json.dumps(

                profile.__dict__,

                indent=4,

            )

        )