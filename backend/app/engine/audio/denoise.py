from app.config import FFMPEG
import subprocess


class Denoise:

    """
    MCAIE Adaptive Denoise Engine v2

    Designed for speech.
    Preserves natural voice while
    removing steady background noise.
    """

    def process(

        self,

        input_file: str,

        output_file: str,

        strength: float = 0.35,

    ):

        #
        # Adaptive FFT Noise Reduction
        #

        noise_reduction = 8 + (strength * 8)

        noise_floor = -38 + (strength * 6)

        filters = ",".join([

            #
            # Remove sub-bass rumble
            #

            "highpass=f=70",

            #
            # Preserve speech brightness
            #

            "lowpass=f=17000",

            #
            # Gentle spectral denoise
            #

            f"afftdn="
            f"nr={noise_reduction}:"
            f"nf={noise_floor}:"
            "tn=1:"
            "tr=1:"
            "om=o",

            #
            # Very gentle downward gate
            #

            "agate="
            "threshold=0.008:"
            "ratio=1.3:"
            "attack=20:"
            "release=350",

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