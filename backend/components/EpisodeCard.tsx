from dataclasses import dataclass

from app.engine.mcaie.voiceprint import VoicePrint
from app.engine.mcaie.room import RoomProfile
from app.engine.mcaie.noise import NoiseProfile
from app.engine.mcaie.normalization.voice_consistency import (
    VoiceConsistencyEngine,
)


@dataclass
class MasterPlan:

    denoise: float

    dereverb: float

    warmth_gain: float

    clarity_gain: float

    presence_gain: float

    compression: float

    loudness: float

    limiter: float


class MasterPlanner:

    """
    MCAIE Mastering Planner

    Every processor receives one
    coordinated plan instead of making
    isolated decisions.
    """

    def __init__(self):

        self.consistency = VoiceConsistencyEngine()

    def build(

        self,

        voice: VoicePrint,

        room: RoomProfile,

        noise: NoiseProfile,

    ) -> MasterPlan:

        profile = self.consistency.build(

            voice,

        )

        denoise = min(

            1.0,

            noise.hiss_score * 2,

        )

        dereverb = min(

            1.0,

            room.reverb_score * 4,

        )

        warmth = profile.warmth_shift * 4

        clarity = profile.brightness_shift * 4

        presence = profile.presence_shift * 3

        compression = max(

            1.5,

            min(

                3.5,

                2.5 + profile.dynamics_shift,

            ),

        )

        loudness = -16

        limiter = -1

        return MasterPlan(

            denoise=float(denoise),

            dereverb=float(dereverb),

            warmth_gain=float(warmth),

            clarity_gain=float(clarity),

            presence_gain=float(presence),

            compression=float(compression),

            loudness=float(loudness),

            limiter=float(limiter),

        )