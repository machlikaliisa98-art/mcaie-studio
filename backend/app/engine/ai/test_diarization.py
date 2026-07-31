from app.config import HF_TOKEN
from app.engine.ai.speaker_diarization import AISpeakerDiarization

engine = AISpeakerDiarization(HF_TOKEN)

segments = engine.diarize(
    "storage/uploads/your_audio.mp3"
)

print()

print("=" * 60)

print("SPEAKERS DETECTED")

print("=" * 60)

for segment in segments:

    print(

        f"{segment.speaker:10}"

        f"{segment.start:8.2f}"

        f"{segment.end:8.2f}"

    )