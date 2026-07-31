from pathlib import Path
import subprocess
import tempfile

from app.config import FFMPEG


class SegmentMerger:

    """
    MCAIE Segment Merger

    Version 1

    Reassembles independently mastered
    speech segments into one continuous
    studio-quality recording.
    """

    def merge(

        self,

        segments: list[Path],

        output_file: str,

    ):

        if not segments:

            raise RuntimeError(

                "No mastered segments found."

            )

        with tempfile.NamedTemporaryFile(

            suffix=".txt",

            delete=False,

            mode="w",

        ) as playlist:

            for segment in segments:

                playlist.write(

                    f"file '{segment.as_posix()}'\n"

                )

            playlist_path = playlist.name

        subprocess.run(

            [

                FFMPEG,

                "-y",

                "-f",

                "concat",

                "-safe",

                "0",

                "-i",

                playlist_path,

                "-c",

                "copy",

                output_file,

            ],

            check=True,

        )

        Path(

            playlist_path,

        ).unlink(

            missing_ok=True,

        )

        return output_file