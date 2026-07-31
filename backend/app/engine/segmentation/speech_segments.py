from dataclasses import dataclass
import subprocess

from app.config import FFMPEG


@dataclass
class SpeechSegment:

    start: float

    end: float

    duration: float


class SpeechSegmenter:

    """
    MCAIE Speech Segmentation Engine v1

    Uses silence detection to divide long-form
    conversations into continuous speech regions.

    Future versions:
        - adaptive silence threshold
        - speaker-aware segmentation
        - interruption detection
        - overlap detection
    """

    def segment(

        self,

        audio_file: str,

        silence_db: int = -38,

        silence_duration: float = 0.6,

    ) -> list[SpeechSegment]:

        command = [

            FFMPEG,

            "-i",

            audio_file,

            "-af",

            f"silencedetect=n={silence_db}dB:d={silence_duration}",

            "-f",

            "null",

            "-",

        ]

        result = subprocess.run(

            command,

            capture_output=True,

            text=True,

        )

        current = 0.0

        segments = []

        stderr = result.stderr

        for line in stderr.splitlines():

            if "silence_start:" in line:

                silence = float(

                    line.split(

                        "silence_start:"

                    )[1]

                )

                if silence > current:

                    segments.append(

                        SpeechSegment(

                            start=current,

                            end=silence,

                            duration=silence-current,

                        )

                    )

            elif "silence_end:" in line:

                current = float(

                    line.split(

                        "silence_end:"

                    )[1]

                    .split("|")[0]

                )

        return segments