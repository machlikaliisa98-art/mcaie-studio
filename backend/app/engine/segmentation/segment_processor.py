from pathlib import Path
import tempfile
import subprocess

from app.config import FFMPEG
from app.engine.segmentation.speech_segments import SpeechSegment
from app.engine.mcaie.master import MCAIEMaster


class SegmentProcessor:

    """
    MCAIE Segment Processor

    Version 1

    Processes every speech segment
    independently before the final
    studio master is assembled.
    """

    def __init__(self):

        self.master = MCAIEMaster()

    def process(

        self,

        audio_file: str,

        segment: SpeechSegment,

        output_folder: Path,

        index: int,

    ) -> Path:

        output_folder.mkdir(

            parents=True,

            exist_ok=True,

        )

        clipped = output_folder / f"segment_{index:04}.wav"

        subprocess.run(

            [

                FFMPEG,

                "-y",

                "-i",

                audio_file,

                "-ss",

                str(segment.start),

                "-to",

                str(segment.end),

                "-c:a",

                "pcm_s16le",

                str(clipped),

            ],

            check=True,

        )

        mastered = output_folder / f"master_{index:04}.wav"

        self.master.process(

            str(clipped),

            str(mastered),

        )

        try:

            clipped.unlink()

        except Exception:

            pass

        return mastered