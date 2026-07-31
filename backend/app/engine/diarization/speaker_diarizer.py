from dataclasses import dataclass
from pathlib import Path
import subprocess
import json
import tempfile

from app.config import FFMPEG


@dataclass
class SpeakerSegment:

    start: float

    end: float

    duration: float

    speaker: str


class SpeakerDiarizer:

    """
    First-generation diarizer.

    Current implementation:
    - Splits audio into speech regions using FFmpeg silencedetect.

    Future versions:
    - pyannote
    - WhisperX
    - NVIDIA NeMo
    """

    def diarize(

        self,

        audio_file: str,

    ) -> list[SpeakerSegment]:

        command = [

            FFMPEG,

            "-i",

            audio_file,

            "-af",

            "silencedetect=n=-38dB:d=0.6",

            "-f",

            "null",

            "-",

        ]

        process = subprocess.run(

            command,

            capture_output=True,

            text=True,

        )

        stderr = process.stderr

        speech = []

        current = 0.0

        speaker = 1

        for line in stderr.splitlines():

            if "silence_start:" in line:

                silence = float(

                    line.split("silence_start:")[1]

                )

                if silence > current:

                    speech.append(

                        SpeakerSegment(

                            start=current,

                            end=silence,

                            duration=silence-current,

                            speaker=f"Speaker {speaker}",

                        )

                    )

                speaker += 1

            elif "silence_end:" in line:

                current = float(

                    line.split("silence_end:")[1]

                    .split("|")[0]

                )

        return speech

    def export(

        self,

        segments,

        output: Path,

    ):

        output.write_text(

            json.dumps(

                [

                    s.__dict__

                    for s in segments

                ],

                indent=4,

            )

        )