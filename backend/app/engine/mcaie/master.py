from dataclasses import dataclass
import time

from app.engine.mcaie.analysis import MCAIEAnalysis
from app.engine.mcaie.spectrum import SpectrumAnalyzer
from app.engine.mcaie.voiceprint import VoicePrintAnalyzer
from app.engine.mcaie.noise import NoiseAnalyzer
from app.engine.mcaie.room import RoomAnalyzer


@dataclass
class MasteringDecision:

    highpass_hz: int
    lowpass_hz: int

    eq_low_gain: float
    eq_mid_gain: float
    eq_high_gain: float

    compressor_ratio: float
    compressor_threshold: float

    denoise_strength: float
    dereverb_strength: float

    presence_gain: float

    loudness_target: float

    limiter_ceiling: float


class MCAIEMaster:

    def __init__(self):

        self.analysis = MCAIEAnalysis()
        self.spectrum = SpectrumAnalyzer()
        self.voice = VoicePrintAnalyzer()
        self.noise = NoiseAnalyzer()
        self.room = RoomAnalyzer()

    def analyze(self, audio_file):

        print("\n==============================")
        print("MCAIE ANALYSIS")
        print("==============================")

        start = time.perf_counter()

        print("\n1. Analysis...")
        analysis = self.analysis.analyze(audio_file)
        print(f"Done ({time.perf_counter()-start:.2f}s)")

        start = time.perf_counter()

        print("\n2. Spectrum...")
        spectrum = self.spectrum.analyze(audio_file)
        print(f"Done ({time.perf_counter()-start:.2f}s)")

        start = time.perf_counter()

        print("\n3. VoicePrint...")
        voice = self.voice.analyze(audio_file)
        print(f"Done ({time.perf_counter()-start:.2f}s)")

        start = time.perf_counter()

        print("\n4. Noise...")
        noise = self.noise.analyze(audio_file)
        print(f"Done ({time.perf_counter()-start:.2f}s)")

        start = time.perf_counter()

        print("\n5. Room...")
        room = self.room.analyze(audio_file)
        print(f"Done ({time.perf_counter()-start:.2f}s)")

        highpass = 80
        lowpass = 18000

        eq_low = 0
        eq_mid = 0
        eq_high = 0

        compressor_ratio = 2.5
        compressor_threshold = -18

        denoise = 0.25
        dereverb = 0.20
        presence = 1.5

        loudness = -16

        limiter = -1

        if noise.rumble_score > .20:
            highpass = 120
            eq_low -= 2.5

        if noise.hiss_score > .15:
            eq_high -= 2

        if room.reverb_score > .20:
            dereverb = .65

        if spectrum.mid_energy < .45:
            eq_mid += 2.5
            presence += 1.5

        if spectrum.high_energy < .15:
            eq_high += 1.8

        if voice.warmth < .18:
            eq_low += 1.5

        if analysis.dynamic_range > 22:
            compressor_ratio = 3.5

        elif analysis.dynamic_range < 10:
            compressor_ratio = 1.6

        if noise.severity == "high":
            denoise = .70

        elif noise.severity == "medium":
            denoise = .45

        print("\nDecision Complete\n")

        return MasteringDecision(

            highpass,

            lowpass,

            eq_low,

            eq_mid,

            eq_high,

            compressor_ratio,

            compressor_threshold,

            denoise,

            dereverb,

            presence,

            loudness,

            limiter,

        )