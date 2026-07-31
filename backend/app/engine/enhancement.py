import subprocess

from app.config import FFMPEG


class SpeechEnhancer:

    def enhance(
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

                    "highpass=f=60",

                    "lowpass=f=8000",

                    "afftdn=nr=12:nf=-28",

                    "equalizer=f=180:t=q:w=1:g=2",

                    "equalizer=f=3200:t=q:w=1:g=3",

                    "loudnorm=I=-16:LRA=11:TP=-1.5",

                    "alimiter=limit=0.98",

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

        print()
        print("=" * 60)
        print(f"Enhancing : {input_file}")
        print(f"Output     : {output_file}")
        print("=" * 60)

        result = subprocess.run(

            command,

            capture_output=True,

            text=True,

        )

        if result.returncode != 0:

            print()
            print("=" * 60)
            print("FFMPEG FAILED")
            print("=" * 60)
            print(result.stderr)
            print("=" * 60)

            raise RuntimeError(
                "Speech enhancement failed."
            )

        print("Finished successfully.")

        return output_file