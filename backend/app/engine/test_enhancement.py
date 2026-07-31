from pathlib import Path

from app.engine.enhancement import SpeechEnhancer

source = r"C:\Users\tynek\backend\storage\episodes\test\episode_000.wav"

output = r"C:\Users\tynek\backend\storage\processed\episode_000.wav"

Path(r"C:\Users\tynek\backend\storage\processed").mkdir(
    parents=True,
    exist_ok=True,
)

SpeechEnhancer().enhance(

    source,

    output,

)

print(output)