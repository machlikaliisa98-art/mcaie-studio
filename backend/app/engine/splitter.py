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
    """
    MCAIE Episode Splitter

    Creates sequential fixed-duration episodes.

    The splitter itself does NOT:
        - enhance audio
        - normalize audio
        - remove noise
        - transcribe
        - summarize
        - identify speakers

    Those operations belong to the production pipeline.

    When preserve_audio=True:
        - source sample rate is preserved
        - source channel count is preserved
        - no mastering is performed
        - no normalization is performed

    For WAV/PCM sources, the resulting episodes remain
    uncompressed PCM audio.
    """

    def _duration(
        self,
        audio_file: Path,
    ) -> float:

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

        value = result.stdout.strip()

        if not value:

            raise RuntimeError(
                f"Unable to determine duration "
                f"for {audio_file}"
            )

        return float(value)

    def _audio_info(
        self,
        audio_file: Path,
    ) -> tuple[int, int]:

        result = subprocess.run(
            [
                FFPROBE,

                "-v",
                "error",

                "-select_streams",
                "a:0",

                "-show_entries",
                "stream=sample_rate,channels",

                "-of",
                "default=noprint_wrappers=1:nokey=1",

                str(audio_file),
            ],

            capture_output=True,
            text=True,
            check=True,
        )

        values = [
            value.strip()
            for value in result.stdout.splitlines()
            if value.strip()
        ]

        if len(values) < 2:

            print(
                "WARNING: Unable to determine "
                "source audio characteristics."
            )

            return (
                48000,
                1,
            )

        try:

            sample_rate = int(
                values[0]
            )

            channels = int(
                values[1]
            )

            return (
                sample_rate,
                channels,
            )

        except ValueError:

            print(
                "WARNING: Invalid source audio "
                "characteristics."
            )

            return (
                48000,
                1,
            )

    def split(
        self,
        audio_file: str,
        job_id: str,
        trim_start: float = 0.0,
        episode_minutes: int = 20,
        preserve_audio: bool = True,
    ):

        source = Path(
            audio_file
        )

        # ==========================================================
        # VALIDATION
        # ==========================================================

        if not source.exists():

            raise FileNotFoundError(
                f"Audio file not found: {source}"
            )

        if episode_minutes <= 0:

            raise ValueError(
                "episode_minutes must be greater than zero."
            )

        if trim_start < 0:

            trim_start = 0.0

        # ==========================================================
        # OUTPUT DIRECTORY
        # ==========================================================

        output = (
            EPISODES /
            job_id
        )

        output.mkdir(
            parents=True,
            exist_ok=True,
        )

        # ==========================================================
        # REMOVE PREVIOUS EPISODES
        # ==========================================================

        for episode in output.glob(
            "episode_*.wav"
        ):

            try:

                episode.unlink()

            except OSError as exc:

                print(
                    f"WARNING: Could not remove "
                    f"{episode}: {exc}"
                )

        # ==========================================================
        # SOURCE INFORMATION
        # ==========================================================

        sample_rate, channels = (
            self._audio_info(
                source
            )
        )

        print()
        print("=" * 70)
        print("MCAIE EPISODE SPLITTER")
        print("=" * 70)

        print(
            f"Source            : {source}"
        )

        print(
            f"Sample rate       : "
            f"{sample_rate} Hz"
        )

        print(
            f"Channels          : "
            f"{channels}"
        )

        print(
            f"Trim start        : "
            f"{trim_start:.2f} seconds"
        )

        print(
            f"Episode length    : "
            f"{episode_minutes} minutes"
        )

        print(
            f"Preserve audio    : "
            f"{preserve_audio}"
        )

        print("=" * 70)

        # ==========================================================
        # TEMPORARY MASTER
        # ==========================================================

        trimmed = (
            TEMP /
            f"{job_id}_trimmed.wav"
        )

        if trimmed.exists():

            trimmed.unlink()

        # ==========================================================
        # CREATE MASTER
        # ==========================================================

        print()
        print(
            "Creating temporary episode master..."
        )

        command = [
            FFMPEG,

            "-y",

            "-ss",
            str(trim_start),

            "-i",
            str(source),

            "-vn",
        ]

        if preserve_audio:

            command.extend(
                [
                    "-ar",
                    str(sample_rate),

                    "-ac",
                    str(channels),
                ]
            )

        else:

            command.extend(
                [
                    "-ar",
                    "48000",

                    "-ac",
                    "1",
                ]
            )

        command.extend(
            [
                "-c:a",
                "pcm_s16le",

                str(trimmed),
            ]
        )

        subprocess.run(
            command,
            check=True,
        )

        if not trimmed.exists():

            raise RuntimeError(
                "FFmpeg did not create the "
                "temporary master."
            )

        # ==========================================================
        # DETERMINE DURATION
        # ==========================================================

        duration = self._duration(
            trimmed
        )

        if duration <= 0:

            raise RuntimeError(
                "Audio duration is zero."
            )

        episode_length = (
            episode_minutes *
            60
        )

        total = ceil(
            duration /
            episode_length
        )

        print()
        print("=" * 70)

        print(
            f"Duration          : "
            f"{duration / 60:.2f} minutes"
        )

        print(
            f"Episode length    : "
            f"{episode_minutes} minutes"
        )

        print(
            f"Total episodes    : "
            f"{total}"
        )

        print("=" * 70)

        # ==========================================================
        # CREATE EPISODES
        # ==========================================================

        episodes = []

        for index in range(total):

            start = (
                index *
                episode_length
            )

            remaining = (
                duration -
                start
            )

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

            print()
            print(
                f"Creating episode "
                f"{index + 1}/{total}"
            )

            print(
                f"Start    : "
                f"{start / 60:.2f} minutes"
            )

            print(
                f"Duration : "
                f"{length / 60:.2f} minutes"
            )

            # ------------------------------------------------------
            # The source is already a PCM WAV master.
            #
            # Copying PCM packets avoids another lossy conversion.
            # ------------------------------------------------------

            subprocess.run(
                [
                    FFMPEG,

                    "-y",

                    "-ss",
                    str(start),

                    "-i",
                    str(trimmed),

                    "-t",
                    str(length),

                    "-c:a",
                    "copy",

                    str(episode),
                ],

                check=True,
            )

            if not episode.exists():

                raise RuntimeError(
                    f"Episode was not created: "
                    f"{episode}"
                )

            episodes.append(
                episode
            )

            print(
                f"SUCCESS: "
                f"{episode.name}"
            )

        # ==========================================================
        # CLEAN TEMP FILE
        # ==========================================================

        try:

            if trimmed.exists():

                trimmed.unlink()

        except OSError as exc:

            print(
                f"WARNING: Could not remove "
                f"{trimmed}: {exc}"
            )

        # ==========================================================
        # FINAL REPORT
        # ==========================================================

        print()
        print("=" * 70)
        print("EPISODES CREATED")
        print("=" * 70)

        for episode in episodes:

            print(
                episode.name
            )

        print("=" * 70)
        print()

        if not episodes:

            raise RuntimeError(
                "No episodes were created."
            )

        return episodes