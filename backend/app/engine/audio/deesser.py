from app.config import FFMPEG
import subprocess


class DeEsser:

    def process(
        self,
        input_file: str,
        output_file: str,
    ):

        filters = ",".join([

            # Reduce harsh sibilance
            "equalizer="
            "f=6200:"
            "t=q:"
            "w=1.2:"
            "g=-4",

            # Smooth upper mids
            "equalizer="
            "f=7800:"
            "t=q:"
            "w=1.4:"
            "g=-2",

            # Restore natural presence
            "equalizer="
            "f=3200:"
            "t=q:"
            "w=1:"
            "g=1",

        ])

        command = [

            FFMPEG,

            "-y",

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

        )

        return output_file