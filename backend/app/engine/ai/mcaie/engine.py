from dataclasses import dataclass
import wave
import numpy as np


@dataclass
class SpeechSegment:

    start: float
    end: float
    energy: float


class SpeechSegmenter:

    FRAME_MS = 30
    HOP_MS = 15

    def segment(

        self,

        audio_file: str,

    ) -> list[SpeechSegment]:

        with wave.open(audio_file, "rb") as wav:

            sample_rate = wav.getframerate()

            channels = wav.getnchannels()

            frames = wav.readframes(

                wav.getnframes()

            )

        signal = np.frombuffer(

            frames,

            dtype=np.int16,

        ).astype(np.float32)

        if channels > 1:

            signal = signal.reshape(

                -1,

                channels,

            ).mean(axis=1)

        signal /= 32768.0

        frame = int(

            sample_rate *

            self.FRAME_MS /

            1000

        )

        hop = int(

            sample_rate *

            self.HOP_MS /

            1000

        )

        energy = []

        for i in range(

            0,

            len(signal) - frame,

            hop,

        ):

            block = signal[

                i:i + frame

            ]

            energy.append(

                np.sqrt(

                    np.mean(

                        block ** 2

                    )

                )

            )

        energy = np.asarray(

            energy,

            dtype=np.float32,

        )

        threshold = max(

            0.02,

            energy.mean() * 0.45,

        )

        segments = []

        active = False

        start = 0

        current = []

        for i, e in enumerate(

            energy

        ):

            t = (

                i * hop

            ) / sample_rate

            if e > threshold:

                if not active:

                    active = True

                    start = t

                    current = []

                current.append(e)

            elif active:

                segments.append(

                    SpeechSegment(

                        start=start,

                        end=t,

                        energy=float(

                            np.mean(

                                current

                            )

                        ),

                    )

                )

                active = False

        if active:

            segments.append(

                SpeechSegment(

                    start=start,

                    end=len(signal) / sample_rate,

                    energy=float(

                        np.mean(

                            current

                        )

                    ),

                )

            )

        return segments