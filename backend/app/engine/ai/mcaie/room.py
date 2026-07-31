from dataclasses import dataclass
import wave
import numpy as np


@dataclass
class RoomProfile:

    reverb_score: float
    echo_score: float
    room_size: str
    reflections: float
    treatment_score: float


class RoomAnalyzer:

    SAMPLE_SECONDS = 20
    WINDOW = 4096

    def analyze(

        self,

        audio_file: str,

    ) -> RoomProfile:

        with wave.open(audio_file, "rb") as wav:

            sample_rate = wav.getframerate()
            channels = wav.getnchannels()

            frames_to_read = min(

                sample_rate * self.SAMPLE_SECONDS,

                wav.getnframes(),

            )

            frames = wav.readframes(frames_to_read)

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

        #
        # Short-time energy analysis
        #

        hop = self.WINDOW

        energies = []

        for i in range(

            0,

            len(signal) - hop,

            hop,

        ):

            frame = signal[i:i + hop]

            energies.append(

                np.mean(

                    frame ** 2

                )

            )

        energies = np.asarray(

            energies,

            dtype=np.float32,

        )

        if len(energies) < 10:

            return RoomProfile(

                reverb_score=0,

                echo_score=0,

                room_size="Unknown",

                reflections=0,

                treatment_score=1,

            )

        #
        # Normalize
        #

        energies /= (

            energies.max()

            + 1e-9

        )

        #
        # Energy decay
        #

        decay = np.diff(

            energies

        )

        decay = np.abs(

            decay

        )

        reverb = float(

            np.mean(

                decay

            )

        )

        echo = float(

            np.percentile(

                decay,

                95,

            )

        )

        reflections = float(

            np.std(

                decay

            )

        )

        treatment = max(

            0.0,

            1.0 - reverb * 4,

        )

        if reverb < 0.03:

            room = "Studio"

        elif reverb < 0.06:

            room = "Office"

        elif reverb < 0.10:

            room = "Meeting Room"

        else:

            room = "Hall"

        return RoomProfile(

            reverb_score=reverb,

            echo_score=echo,

            room_size=room,

            reflections=reflections,

            treatment_score=treatment,

        )