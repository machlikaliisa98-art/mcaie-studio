from math import ceil
from pathlib import Path
import subprocess

from app.config import (
    EPISODES,
    TEMP,
    FFMPEG,
    FFPROBE,
)


class EpisodeSplitter:

    def _duration(self, audio_file: Path) -> float:

        result = subprocess.run(

            [

                FFPROBE,

                "-v",
                "error",

                "-show_entries",
                "format=duration",

                "-of",
                "default=noprint_wrappers=1:nokey=1",

                str(audio_file),

            ],

            capture_output=True,
            text=True,
            check=True,

        )

        return float(result.stdout.strip())

    def split(

        self,

        audio_file: str,

        job_id: str,

        trim_start: float = 0.0,

        episode_minutes: int = 30,

    ):

        output = EPISODES / job_id

        output.mkdir(
            parents=True,
            exist_ok=True,
        )

        #
        # remove previous episodes
        #

        for file in output.glob("episode_*.wav"):
            file.unlink()

        trimmed = TEMP / f"{job_id}_trimmed.wav"

        if trimmed.exists():
            trimmed.unlink()

        #
        # STEP 1
        # create ONE trimmed master
        #

        subprocess.run(

            [

                FFMPEG,

                "-y",

                "-ss",
                str(trim_start),

                "-i",
                audio_file,

                "-vn",

                "-ac",
                "1",

                "-ar",
                "48000",

                "-c:a",
                "pcm_s16le",

                str(trimmed),

            ],

            check=True,

        )

        duration = self._duration(trimmed)

        episode_length = episode_minutes * 60

        total = ceil(duration / episode_length)

        print()
        print("=" * 60)
        print(f"Trimmed duration : {duration:.2f}s")
        print(f"Episodes         : {total}")
        print("=" * 60)

        #
        # STEP 2
        # create every episode individually
        #

        episodes = []

        for index in range(total):

            start = index * episode_length

            remaining = duration - start

            if remaining <= 1:
                break

            length = min(
                episode_length,
                remaining,
            )

            episode = (
                output /
                f"episode_{index:03d}.wav"
            )

            subprocess.run(

                [

                    FFMPEG,

                    "-y",

                    "-ss",
                    str(start),

                    "-t",
                    str(length),

                    "-i",
                    str(trimmed),

                    "-c:a",
                    "copy",

                    str(episode),

                ],

                check=True,

            )

            episodes.append(
                episode
            )

            print(
                f"Episode {index+1}: "
                f"{length/60:.2f} min"
            )

        print()
        print("=" * 60)
        print("EPISODES CREATED")
        print("=" * 60)

        for e in episodes:
            print(e.name)

        print("=" * 60)
        print()

        return episodes