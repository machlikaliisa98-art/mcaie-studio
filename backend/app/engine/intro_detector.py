import subprocess
import tempfile
from pathlib import Path

from faster_whisper import WhisperModel

from app.config import FFMPEG


class IntroDetector:

    def __init__(self):

        self.model = WhisperModel(
            "base",
            device="cpu",
            compute_type="int8",
        )

        self.start_keywords = [

            "welcome",

            "good evening",

            "good morning",

            "good afternoon",

            "today",

            "tonight",

            "discussion",

            "conversation",

            "thank you for joining",

            "man cave",

            "let us begin",

            "let's begin",

            "our topic",

            "our discussion",

            "today we",

            "this evening",

        ]

        self.skip_keywords = [

            "music",

            "starting shortly",

            "waiting",

            "please wait",

            "test",

            "testing",

            "one minute",

            "few minutes",

            "can you hear",

            "mic check",

        ]

    def _extract_intro(self, audio_file: str):

        temp = Path(tempfile.gettempdir()) / "mcae_intro.wav"

        command = [

            FFMPEG,

            "-y",

            "-i",
            audio_file,

            "-t",
            "300",

            "-ac",
            "1",

            "-ar",
            "16000",

            "-c:a",
            "pcm_s16le",

            str(temp),

        ]

        subprocess.run(

            command,

            stdout=subprocess.DEVNULL,

            stderr=subprocess.DEVNULL,

            check=True,

        )

        return str(temp)

    def detect(self, audio_file: str):

        intro = self._extract_intro(audio_file)

        segments, _ = self.model.transcribe(

            intro,

            vad_filter=True,

            beam_size=1,

        )

        best_score = -999

        best_time = 0

        print("\n========== INTRO ANALYSIS ==========\n")

        for segment in segments:

            text = segment.text.lower().strip()

            score = 0

            for word in self.skip_keywords:

                if word in text:
                    score -= 100

            for word in self.start_keywords:

                if word in text:
                    score += 50

            score += min(

                len(text),

                100,

            ) / 10

            print(

                f"{segment.start:7.2f}s | {score:6.1f} | {text}"

            )

            if score > best_score:

                best_score = score

                best_time = segment.start

        print("\n===================================")

        print(f"Podcast starts at : {best_time:.2f}s")

        print("===================================\n")

        return best_time