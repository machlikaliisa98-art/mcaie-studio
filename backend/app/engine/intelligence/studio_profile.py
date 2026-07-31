from dataclasses import dataclass


@dataclass
class StudioProfile:

    #
    # Target loudness
    #
    target_lufs: float = -16.0

    #
    # True peak
    #
    target_peak: float = -1.0

    #
    # Preferred dynamics
    #
    target_dynamic_range: float = 18.0

    #
    # Speech spectrum
    #
    target_warmth: float = 0.82

    target_clarity: float = 0.93

    target_presence: float = 0.90

    target_air: float = 0.78

    #
    # Room
    #
    target_reverb: float = 0.05

    target_noise: float = 0.01

    #
    # Voice characteristics
    #
    target_consistency: float = 0.95

    target_intelligibility: float = 0.97

    target_microphone = "Studio Condenser"

    target_environment = "Acoustically Treated"

    target_signature = "Man Cave Studio Signature"


class StudioReference:

    def __init__(self):

        self.profile = StudioProfile()

    def get(self):

        return self.profile