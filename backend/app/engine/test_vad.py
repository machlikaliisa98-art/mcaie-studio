from app.engine.preprocessor import AudioPreprocessor
from app.engine.vad import VoiceActivityDetector

wav = AudioPreprocessor().create_analysis_audio(

    r"C:\Users\tynek\Downloads\The cost of _I am Fine . X space.mp3"

)

speech = VoiceActivityDetector().detect(

    wav,

)

print()

print("=" * 60)

print("VOICE ACTIVITY")

print("=" * 60)

for start, end in speech:

    print(

        f"{start:8.2f}  -->  {end:8.2f}"

    )

print("=" * 60)