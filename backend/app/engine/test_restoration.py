from pathlib import Path
import sys

from app.engine.restoration import RestorationEngine


def main():

    if len(sys.argv) < 2:

        print(
            r'python -m app.engine.test_restoration "episode.wav"'
        )

        return

    input_audio = Path(sys.argv[1])

    output = input_audio.with_name(
        input_audio.stem + "_restored.wav"
    )

    RestorationEngine().process(

        str(input_audio),

        str(output),

    )

    print()

    print("=" * 50)

    print("RESTORATION COMPLETE")

    print(output)

    print("=" * 50)


if __name__ == "__main__":
    main()