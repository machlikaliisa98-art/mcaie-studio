from dataclasses import dataclass

from app.engine.intelligence.speaker_analyzer import SpeakerAnalyzer
from app.engine.intelligence.noise_profiler import NoiseProfiler
from app.engine.intelligence.room_profiler import RoomProfiler
from app.engine.intelligence.voice_matcher import VoiceMatcher

from app.engine.diarization.speaker_diarizer import (
    SpeakerDiarizer,
)


@dataclass
class AudioIntelligenceReport:

    segments: list

    speaker: object

    noise: object

    room: object

    voice: object


class AudioIntelligence:

    def __init__(self):

        self.diarizer = SpeakerDiarizer()

        self.speaker = SpeakerAnalyzer()

        self.noise = NoiseProfiler()

        self.room = RoomProfiler()

        self.matcher = VoiceMatcher()

    def analyze(

        self,

        audio_file: str,

    ):

        print()
        print("=" * 70)
        print("MAN CAVE AUDIO INTELLIGENCE ENGINE")
        print("=" * 70)

        segments = self.diarizer.diarize(

            audio_file,

        )

        speaker = self.speaker.analyze(

            audio_file,

        )

        noise = self.noise.profile(

            audio_file,

        )

        room = self.room.profile(

            audio_file,

        )

        voice = self.matcher.match(

            speaker,

        )

        print()

        print(f"Speech Segments : {len(segments)}")

        for index, segment in enumerate(

            segments,

            start=1,

        ):

            print(

                f"{index:03d} | "

                f"{segment.start:8.2f}s "

                f"-> "

                f"{segment.end:8.2f}s "

                f"| "

                f"{segment.duration:7.2f}s"

            )

        print()

        print(f"Noise       : {noise.severity}")

        print(f"Room        : {room.room_type}")

        print(f"Microphone  : {speaker.estimated_microphone}")

        print(f"Confidence  : {voice.confidence:.2f}")

        print("=" * 70)
        print()

        return AudioIntelligenceReport(

            segments=segments,

            speaker=speaker,

            noise=noise,

            room=room,

            voice=voice,

        )