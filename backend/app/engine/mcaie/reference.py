from dataclasses import dataclass


@dataclass(frozen=True)
class StudioReference:

    #
    # MCAIE Studio Reference v1
    #

    loudness_lufs = -16.0

    true_peak_db = -1.0

    speech_range_low = 250

    speech_range_high = 4000

    target_dynamic_range = 14.0

    max_noise_floor = 0.015

    max_reverb = 0.08

    target_presence = 0.65

    target_warmth = 0.22

    target_brightness = 0.18

    target_snr = 35.0

    target_consistency = 95.0