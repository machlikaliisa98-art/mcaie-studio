from app.config import FFMPEG
import subprocess


class DeReverb:

    """
    MCAIE Room Correction Engine v2

    Reduces room resonance and improves
    speech clarity without introducing
    artificial echo.
    """

    def process(

        self,

        input_file: str,

        output_file: str,

        strength: float = 0.35,

    ):

        low_cut = 2 + (strength * 3)
        presence = 1.5 + (strength * 1.5)
        air = 1.0 + (strength * 1.0)

        filters = ",".join([

            #
            # Remove sub-room rumble
            #

            "highpass=f=90",

            #
            # Remove room bloom
            #

            f"equalizer=f=180:t=q:w=1.4:g=-{2.5 + strength * 2:.1f}",

            #
            # Remove low-mid room resonance
            #

            f"equalizer=f=320:t=q:w=1.3:g=-{1.5 + strength * 2:.1f}",

            #
            # Remove boxiness
            #

            f"equalizer=f=520:t=q:w=1.2:g=-{1.2 + strength:.1f}",

            #
            # Improve articulation
            #

            f"equalizer=f=2800:t=q:w=1:g={presence:.1f}",

            #
            # Restore presence
            #

            f"equalizer=f=4200:t=q:w=1:g={presence * 0.6:.1f}",

            #
            # Restore air
            #

            f"equalizer=f=8500:t=q:w=0.8:g={air:.1f}",

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