from pathlib import Path
import subprocess
import tempfile

from app.config import FFMPEG


class AudioPreprocessor:

    def create_analysis_audio(

        self,

        source: str,

        seconds: int = 300,

    ) -> str:

        output = Path(

            tempfile.gettempdir()

        ) / "mcae_analysis.wav"

        command = [

            FFMPEG,

            "-y",

            "-i",
            source,

            "-t",
            str(seconds),

            "-vn",

            "-ac",
            "1",

            "-ar",
            "16000",

            "-c:a",
            "pcm_s16le",

            str(output),

        ]

        subprocess.run(

            command,

            check=True,

            stdout=subprocess.DEVNULL,

            stderr=subprocess.DEVNULL,

        )

        return str(output)