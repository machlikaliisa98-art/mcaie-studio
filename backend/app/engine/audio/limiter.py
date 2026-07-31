from app.config import FFMPEG
import subprocess


class Limiter:

    """
    MCAIE Broadcast Limiter
    """

    def process(

        self,

        input_file: str,

        output_file: str,

        ceiling: float = -1.0,

    ):

        limit = 10 ** (ceiling / 20)

        filters = ",".join([

            f"alimiter=limit={limit:.3f}:attack=3:release=40",

            "acompressor="
            "threshold=-2dB:"
            "ratio=20:"
            "attack=1:"
            "release=25",

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