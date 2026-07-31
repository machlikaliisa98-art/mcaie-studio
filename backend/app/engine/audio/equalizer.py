from app.config import FFMPEG
import subprocess


class Equalizer:

    """
    MCAIE Adaptive Voice Equalizer

    Tuned for podcasts, interviews,
    X Spaces and spoken-word recordings.
    """

    def process(

        self,

        input_file: str,

        output_file: str,

        low_gain: float = 1.5,

        mid_gain: float = 2.5,

        high_gain: float = 1.5,

    ):

        filters = ",".join([

            #
            # Remove microphone rumble
            #

            "highpass=f=75",

            #
            # Remove ultrasonic noise
            #

            "lowpass=f=17000",

            #
            # Add warmth
            #

            f"equalizer=f=110:t=q:w=1.1:g={low_gain:.1f}",

            #
            # Remove mud
            #

            "equalizer=f=250:t=q:w=1.2:g=-2",

            #
            # Remove boxiness
            #

            "equalizer=f=500:t=q:w=1.2:g=-1.5",

            #
            # Speech clarity
            #

            f"equalizer=f=2800:t=q:w=1:g={mid_gain:.1f}",

            #
            # Vocal presence
            #

            f"equalizer=f=4300:t=q:w=1:g={high_gain:.1f}",

            #
            # Air
            #

            "equalizer=f=9000:t=q:w=0.8:g=1",

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