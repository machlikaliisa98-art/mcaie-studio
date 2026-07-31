from pprint import pprint
import sys

from app.engine.inspector import AudioInspector

if len(sys.argv) < 2:

    print(
        r'python -m app.engine.test_inspector "audio.mp3"'
    )

    raise SystemExit

inspection = AudioInspector().inspect(

    sys.argv[1]

)

print()

print("=" * 50)

pprint(inspection)

print("=" * 50)