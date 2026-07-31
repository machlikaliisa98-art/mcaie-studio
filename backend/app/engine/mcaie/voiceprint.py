from dataclasses import dataclass
import wave
import numpy as np


@dataclass
class VoicePrint:

    pitch: float
    brightness: float
    warmth: float
    clarity: float
    dynamics: float
    voice_energy: float
    fingerprint: list[float]


class VoicePrintAnalyzer:

    SAMPLE_SECONDS = 20

    FFT_SIZE = 16384

    def analyze(

        self,

        audio_file: str,

    ) -> VoicePrint:

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

        peak = np.max(

            np.abs(signal)

        )

        dynamics = peak / max(

            rms,

            1e-6,

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

        dominant = np.argmax(

            spectrum

        )

        pitch = float(

            frequencies[dominant]

        )

        low = spectrum[

            frequencies < 250

        ].sum()

        mid = spectrum[

            (frequencies >= 250)

            &

            (frequencies < 4000)

        ].sum()

        high = spectrum[

            frequencies >= 4000

        ].sum()

        total = low + mid + high

        if total == 0:

            total = 1

        warmth = float(low / total)

        clarity = float(mid / total)

        brightness = float(high / total)

        fingerprint = [

            round(pitch, 2),

            round(warmth, 4),

            round(clarity, 4),

            round(brightness, 4),

            round(dynamics, 4),

        ]

        return VoicePrint(

            pitch=pitch,

            brightness=brightness,

            warmth=warmth,

            clarity=clarity,

            dynamics=float(dynamics),

            voice_energy=float(rms),

            fingerprint=fingerprint,

        )