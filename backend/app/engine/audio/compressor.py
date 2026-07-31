from app.config import FFMPEG
import subprocess


class Compressor:

    """
    MCAIE Adaptive Broadcast Compressor

    Designed for podcasts, interviews,
    X Spaces and spoken-word recordings.
    """

    def process(

        self,

        input_file: str,

        output_file: str,

        threshold: float = -18.0,

        ratio: float = 2.5,

    ):

        filters = ",".join([

            #
            # Adaptive compression
            #

            "acompressor="
            f"threshold={threshold}dB:"
            f"ratio={ratio}:"
            "attack=8:"
            "release=180:"
            "makeup=3",

            #
            # Prevent clipping
            #

            "alimiter=limit=0.97",

            #
            # Smooth loudness between speakers
            #

            "dynaudnorm="
            "f=200:"
            "g=8"

        ])

        command = [

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

        ]

        subprocess.run(

            command,

            check=True,

            timeout=180,

        )

        return output_file