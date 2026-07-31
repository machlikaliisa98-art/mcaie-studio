import sys

from app.engine.intro_detector import IntroDetector

if len(sys.argv) < 2:

    print(
        r'python -m app.engine.test_intro "audio.mp3"'
    )

    raise SystemExit

detector = IntroDetector()

start = detector.detect(

    sys.argv[1]

)

print()

print("=" * 50)

print("FIRST SPEAKER")

print(start)

print("=" * 50)