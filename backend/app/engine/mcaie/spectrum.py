from dataclasses import dataclass

import numpy as np

from app.engine.audio.decoder import AudioDecoder


@dataclass
class SpectrumProfile:

    rms: float
    peak: float
    crest_factor: float
    zero_crossing_rate: float
    low_energy: float
    mid_energy: float
    high_energy: float


class SpectrumAnalyzer:

    SAMPLE_SECONDS = 20

    def __init__(self):

        self.decoder = AudioDecoder()

    def analyze(

        self,

        audio_file: str,

    ) -> SpectrumProfile:

        #
        # Universal decoding
        #

        signal, sample_rate = self.decoder.decode(

            audio_file,

        )

        #
        # Analyze only the first SAMPLE_SECONDS
        #

        max_samples = sample_rate * self.SAMPLE_SECONDS

        signal = signal[:max_samples]

        if len(signal) == 0:

            return SpectrumProfile(

                rms=0.0,

                peak=0.0,

                crest_factor=0.0,

                zero_crossing_rate=0.0,

                low_energy=0.0,

                mid_energy=0.0,

                high_energy=0.0,

            )

        #
        # Time-domain analysis
        #

        rms = np.sqrt(

            np.mean(

                signal ** 2

            )

        )

        peak = np.max(

            np.abs(signal)

        )

        crest = peak / max(

            rms,

            1e-6,

        )

        zero = np.mean(

            np.abs(

                np.diff(

                    np.sign(signal)

                )

            )

        )

        #
        # Frequency-domain analysis
        #

        fft_size = min(

            16384,

            len(signal),

        )

        spectrum_signal = signal[:fft_size]

        spectrum = np.abs(

            np.fft.rfft(

                spectrum_signal

            )

        )

        frequencies = np.fft.rfftfreq(

            len(spectrum_signal),

            1 / sample_rate,

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

        if total <= 0:

            total = 1.0

        return SpectrumProfile(

            rms=float(rms),

            peak=float(peak),

            crest_factor=float(crest),

            zero_crossing_rate=float(zero),

            low_energy=float(low / total),

            mid_energy=float(mid / total),

            high_energy=float(high / total),

        )