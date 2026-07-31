from dataclasses import dataclass
import wave
import numpy as np


@dataclass
class NoiseProfile:

    noise_floor: float
    signal_to_noise: float
    hiss_score: float
    hum_score: float
    rumble_score: float
    wind_score: float
    severity: str


class NoiseAnalyzer:

    SAMPLE_SECONDS = 20

    FFT_SIZE = 16384

    def analyze(

        self,

        audio_file: str,

    ) -> NoiseProfile:

        with wave.open(audio_file, "rb") as wav:

            sample_rate = wav.getframerate()
            channels = wav.getnchannels()
            total_frames = wav.getnframes()

            frames_to_read = min(

                sample_rate * self.SAMPLE_SECONDS,

                total_frames,

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

        rms = np.sqrt(

            np.mean(

                signal ** 2

            )

        )

        #
        # Small FFT
        #

        if len(signal) > self.FFT_SIZE:

            signal = signal[: self.FFT_SIZE]

        spectrum = np.abs(

            np.fft.rfft(

                signal

            )

        )

        frequencies = np.fft.rfftfreq(

            len(signal),

            1 / sample_rate,

        )

        low = spectrum[

            frequencies < 120

        ].sum()

        speech = spectrum[

            (frequencies >= 120)

            &

            (frequencies <= 4000)

        ].sum()

        high = spectrum[

            frequencies > 7000

        ].sum()

        total = low + speech + high

        if total == 0:

            total = 1

        rumble = float(low / total)

        hiss = float(high / total)

        hum = float(

            spectrum[

                (frequencies >= 45)

                &

                (frequencies <= 65)

            ].sum()

            / total

        )

        wind = float(

            spectrum[

                (frequencies >= 20)

                &

                (frequencies <= 180)

            ].sum()

            / total

        )

        noise_floor = min(

            float(rms),

            0.05,

        )

        snr = float(

            speech

            / max(

                noise_floor,

                1e-6,

            )

        )

        score = (

            hiss

            + hum

            + rumble

            + wind

        ) / 4

        if score > 0.30:

            severity = "high"

        elif score > 0.15:

            severity = "medium"

        else:

            severity = "low"

        return NoiseProfile(

            noise_floor=noise_floor,

            signal_to_noise=snr,

            hiss_score=hiss,

            hum_score=hum,

            rumble_score=rumble,

            wind_score=wind,

            severity=severity,

        )