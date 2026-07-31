import subprocess

import numpy as np

from app.config import FFMPEG


class AudioDecoder:

    """
    MCAIE Universal Audio Decoder

    Converts any supported audio format into
    48 kHz mono PCM float32 samples.

    Supported formats depend on FFmpeg and include:
    MP3, WAV, FLAC, M4A, AAC, OGG, OPUS, WMA, AIFF...
    """

    SAMPLE_RATE = 48000

    CHANNELS = 1

    def decode(

        self,

        audio_file: str,

    ) -> tuple[np.ndarray, int]:

        command = [

            FFMPEG,

            "-hide_banner",

            "-loglevel",

            "error",

            "-i",

            audio_file,

            "-f",

            "s16le",

            "-acodec",

            "pcm_s16le",

            "-ac",

            str(self.CHANNELS),

            "-ar",

            str(self.SAMPLE_RATE),

            "-",

        ]

        process = subprocess.run(

            command,

            stdout=subprocess.PIPE,

            stderr=subprocess.PIPE,

            check=True,

        )

        signal = np.frombuffer(

            process.stdout,

            dtype=np.int16,

        ).astype(np.float32)

        signal /= 32768.0

        return signal, self.SAMPLE_RATE