from pathlib import Path
import subprocess

from app.config import (
    FFMPEG,
    TEMP,
)


class AudioNormalizer:

    """
    MCAIE Universal Audio Normalizer

    Every uploaded recording is converted into
    a canonical production format before any AI
    engine touches it.

    Output

    • WAV
    • PCM 16-bit
    • 48 kHz
    • Mono
    """

    SAMPLE_RATE = 48000

    CHANNELS = 1

    def normalize(

        self,

        audio_file: str,

    ) -> str:

        output = TEMP / (

            Path(audio_file).stem +

            "_normalized.wav"

        )

        command = [

            FFMPEG,

            "-y",

            "-hide_banner",

            "-loglevel",

            "error",

            "-i",

            audio_file,

            "-ar",

            str(self.SAMPLE_RATE),

            "-ac",

            str(self.CHANNELS),

            "-c:a",

            "pcm_s16le",

            str(output),

        ]

        subprocess.run(

            command,

            check=True,

        )

        return str(output)