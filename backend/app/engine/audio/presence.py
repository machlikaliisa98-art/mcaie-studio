from app.config import FFMPEG
import subprocess


class Presence:

    """
    MCAIE Presence Engine
    """

    def process(

        self,

        input_file: str,

        output_file: str,

        gain: float = 2.0,

    ):

        filters = ",".join([

            "highpass=f=75",

            "equalizer=f=140:t=q:w=1.2:g=1.5",

            "equalizer=f=280:t=q:w=1:g=-1.2",

            f"equalizer=f=2600:t=q:w=1:g={gain:.1f}",

            f"equalizer=f=4200:t=q:w=1:g={gain:.1f}",

            "equalizer=f=10000:t=q:w=1:g=1",

            "volume=1.02",

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