from dataclasses import dataclass

from app.engine.intelligence.studio_profile import (
    StudioReference,
)

from app.engine.intelligence.speaker_analyzer import (
    SpeakerProfile,
)


@dataclass
class VoiceAdjustment:

    loudness_gain: float

    clarity_gain: float

    warmth_gain: float

    presence_gain: float

    dynamic_gain: float

    noise_reduction: float

    dereverb_strength: float

    microphone_match: str

    room_match: str

    confidence: float


class VoiceMatcher:

    def __init__(self):

        self.reference = StudioReference().get()

    def match(

        self,

        speaker: SpeakerProfile,

    ) -> VoiceAdjustment:

        loudness_gain = (

            self.reference.target_lufs

            - speaker.rms

        )

        clarity_gain = (

            self.reference.target_clarity

            - speaker.clarity_score

        )

        warmth_gain = (

            self.reference.target_warmth

            - speaker.warmth_score

        )

        dynamic_gain = (

            self.reference.target_dynamic_range

            - speaker.dynamic_range

        )

        if speaker.estimated_noise == "high":

            noise = 1.00

        elif speaker.estimated_noise == "medium":

            noise = 0.60

        else:

            noise = 0.20

        if speaker.estimated_room == "large":

            dereverb = 1.00

        elif speaker.estimated_room == "medium":

            dereverb = 0.50

        else:

            dereverb = 0.15

        if clarity_gain > 0:

            presence = clarity_gain

        else:

            presence = 0

        confidence = (

            speaker.clarity_score

            + speaker.warmth_score

        ) / 2

        return VoiceAdjustment(

            loudness_gain=loudness_gain,

            clarity_gain=clarity_gain,

            warmth_gain=warmth_gain,

            presence_gain=presence,

            dynamic_gain=dynamic_gain,

            noise_reduction=noise,

            dereverb_strength=dereverb,

            microphone_match=self.reference.target_microphone,

            room_match=self.reference.target_environment,

            confidence=confidence,

        )