from pathlib import Path
import tempfile
import os
import subprocess
import traceback

from app.config import (
    FFMPEG,
    TEMP,
)

from app.engine.mcaie.master import MCAIEMaster

from app.engine.audio.equalizer import Equalizer
from app.engine.audio.compressor import Compressor
from app.engine.audio.denoise import Denoise
from app.engine.audio.dereverb import DeReverb
from app.engine.audio.deesser import DeEsser
from app.engine.audio.presence import Presence
from app.engine.audio.loudness import Loudness
from app.engine.audio.limiter import Limiter


class AudioMaster:

    def __init__(self):

        self.mcaie = MCAIEMaster()

        self.equalizer = Equalizer()
        self.compressor = Compressor()
        self.denoise = Denoise()
        self.dereverb = DeReverb()
        self.deesser = DeEsser()
        self.presence = Presence()
        self.loudness = Loudness()
        self.limiter = Limiter()

    def process(

        self,

        input_file: str,

        output_file: str,

    ):

        print("\n" + "=" * 70)
        print("MCAIE MASTERING ENGINE")
        print("=" * 70)

        #
        # Analyze recording
        #

        decision = self.mcaie.analyze(input_file)

        print("\nMastering Decision")
        print(decision)
        print()

        current = input_file

        temporary = []

        chain = [

            self.denoise,
            self.dereverb,
            self.equalizer,
            self.presence,
            self.compressor,
            self.deesser,
            self.loudness,
            self.limiter,

        ]

        for engine in chain:

            #
            # IMPORTANT
            # Use MCAIE temp directory instead
            # of Windows Temp.
            #

            tmp = tempfile.NamedTemporaryFile(

                dir=str(TEMP),

                suffix=".wav",

                delete=False,

            )

            tmp.close()

            destination = tmp.name

            temporary.append(destination)

            print("-" * 60)
            print(f"Running {engine.__class__.__name__}")

            try:

                if isinstance(engine, Denoise):

                    engine.process(

                        current,

                        destination,

                        strength=decision.denoise_strength,

                    )

                elif isinstance(engine, DeReverb):

                    engine.process(

                        current,

                        destination,

                        strength=decision.dereverb_strength,

                    )

                elif isinstance(engine, Equalizer):

                    engine.process(

                        current,

                        destination,

                        low_gain=decision.eq_low_gain,

                        mid_gain=decision.eq_mid_gain,

                        high_gain=decision.eq_high_gain,

                    )

                elif isinstance(engine, Compressor):

                    engine.process(

                        current,

                        destination,

                        threshold=decision.compressor_threshold,

                        ratio=decision.compressor_ratio,

                    )

                elif isinstance(engine, Presence):

                    try:

                        engine.process(

                            current,

                            destination,

                            gain=decision.presence_gain,

                        )

                    except TypeError:

                        engine.process(

                            current,

                            destination,

                        )

                elif isinstance(engine, Loudness):

                    try:

                        engine.process(

                            current,

                            destination,

                            target=decision.loudness_target,

                        )

                    except TypeError:

                        engine.process(

                            current,

                            destination,

                        )

                elif isinstance(engine, Limiter):

                    try:

                        engine.process(

                            current,

                            destination,

                            ceiling=decision.limiter_ceiling,

                        )

                    except TypeError:

                        engine.process(

                            current,

                            destination,

                        )

                else:

                    engine.process(

                        current,

                        destination,

                    )

                print(f"✓ Finished {engine.__class__.__name__}")

                current = destination

            except Exception:

                print(f"✗ {engine.__class__.__name__} failed")

                traceback.print_exc()

                raise

        #
        # Export final master
        #

        Path(output_file).parent.mkdir(

            parents=True,

            exist_ok=True,

        )

        subprocess.run(

            [

                FFMPEG,

                "-y",

                "-hide_banner",

                "-loglevel",

                "error",

                "-i",

                current,

                "-c:a",

                "pcm_s16le",

                output_file,

            ],

            check=True,

            timeout=300,

        )

        #
        # Cleanup
        #

        for file in temporary:

            try:

                os.remove(file)

            except Exception:

                pass

        print("\n" + "=" * 70)
        print("MCAIE MASTERING COMPLETE")
        print("=" * 70)

        return output_file