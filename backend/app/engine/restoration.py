from pathlib import Path
import subprocess
import tempfile

from app.config import FFMPEG


class RestorationEngine:
    """
    Broadcast-quality speech restoration.

    Current Version:
        - High-pass rumble removal
        - Adaptive speech EQ
        - Loudness normalization
        - True peak protection

    This engine is intentionally simple first.
    We'll add AI denoising after validating each stage.
    """

    def process(
        self,
        input_file: str,
        output_file: str,
    ):

        Path(output_file).parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        command = [

            FFMPEG,

            "-y",

            "-i",
            input_file,

            "-af",

            ",".join([

                # Remove low-frequency rumble
                "highpass=f=70",

                # Remove harsh high frequencies
                "lowpass=f=16000",

                # Speech presence
                "equalizer=f=3000:t=q:w=1:g=2",

                # Reduce muddiness
                "equalizer=f=250:t=q:w=1:g=-2",

                # Loudness normalization
                "loudnorm=I=-16:TP=-1.5:LRA=11",

            ]),

            "-ar",
            "48000",

            "-ac",
            "1",

            "-c:a",
            "pcm_s16le",

            output_file,

        ]

        subprocess.run(
            command,
            check=True,
        )

        return output_file