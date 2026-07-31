from app.config import FFMPEG
import subprocess


class Loudness:

    """
    MCAIE Loudness Engine
    """

    def process(

        self,

        input_file: str,

        output_file: str,

        target: float = -16.0,

    ):

        filters = ",".join([

            f"loudnorm=I={target}:LRA=8:TP=-1.0:linear=true",

            "volume=0dB",

        ])

        subprocess.run(

            [

                FFMPEG,

                "-y",

                "-hide_banner",

                "-loglevel",

                "error",

                "-i",

                input_file,

                "-af",

                filters,

                "-ar",

                "48000",

                "-ac",

                "1",

                "-c:a",

                "pcm_s16le",

                output_file,

            ],

            check=True,

            timeout=180,

        )

        return output_file