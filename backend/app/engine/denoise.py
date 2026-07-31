import subprocess

from app.config import FFMPEG


class Denoiser:

    def process(
        self,
        input_file: str,
        output_file: str,
    ):

        command = [

            FFMPEG,

            "-y",

            "-i",
            input_file,

            "-af",

            ",".join(

                [

                    # Remove rumble
                    "highpass=f=70",

                    # Remove hiss
                    "lowpass=f=7800",

                    # Broadband denoise
                    "afftdn=nr=20:nf=-32",

                    # Remove electrical hum
                    "anlmdn=s=8:p=0.002:r=0.01",

                ]

            ),

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