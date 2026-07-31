from dataclasses import dataclass

from app.engine.mcaie.analysis import MCAIEAnalysis
from app.engine.mcaie.spectrum import SpectrumAnalyzer
from app.engine.mcaie.voiceprint import VoicePrintAnalyzer
from app.engine.mcaie.noise import NoiseAnalyzer
from app.engine.mcaie.room import RoomAnalyzer
from app.engine.mcaie.reference import StudioReference


@dataclass
class AudioScore:

    studio_readiness: float

    speech_intelligibility: float

    warmth: float

    presence: float

    noise: float

    echo: float

    dynamics: float

    consistency: float

    broadcast: float

    streaming: float

    overall: float


class MCAIEScore:

    def __init__(self):

        self.analysis = MCAIEAnalysis()
        self.spectrum = SpectrumAnalyzer()
        self.voice = VoicePrintAnalyzer()
        self.noise = NoiseAnalyzer()
        self.room = RoomAnalyzer()

    def clamp(self, value):

        return max(0.0, min(100.0, value))

    def score(self, audio_file: str):

        analysis = self.analysis.analyze(audio_file)
        spectrum = self.spectrum.analyze(audio_file)
        voice = self.voice.analyze(audio_file)
        noise = self.noise.analyze(audio_file)
        room = self.room.analyze(audio_file)

        #
        # Compare everything against the
        # MCAIE Studio Reference
        #

        noise_score = self.clamp(

            100
            -
            (
                noise.noise_floor
                /
                StudioReference.max_noise_floor
            )
            * 100

        )

        echo_score = self.clamp(

            100
            -
            (
                room.reverb_score
                /
                StudioReference.max_reverb
            )
            * 100

        )

        warmth_score = self.clamp(

            100
            -
            abs(

                voice.warmth
                -
                StudioReference.target_warmth

            )
            * 450

        )

        presence_score = self.clamp(

            100
            -
            abs(

                spectrum.mid_energy
                -
                StudioReference.target_presence

            )
            * 250

        )

        dynamics_score = self.clamp(

            100
            -
            abs(

                analysis.dynamic_range
                -
                StudioReference.target_dynamic_range

            )
            * 5

        )

        brightness_score = self.clamp(

            100
            -
            abs(

                voice.brightness
                -
                StudioReference.target_brightness

            )
            * 500

        )

        intelligibility = self.clamp(

            (
                presence_score
                +
                brightness_score
            )
            / 2

        )

        consistency = self.clamp(

            (
                warmth_score
                +
                noise_score
                +
                dynamics_score
            )
            / 3

        )

        broadcast = self.clamp(

            (
                intelligibility
                +
                noise_score
                +
                echo_score
            )
            / 3

        )

        streaming = self.clamp(

            (
                broadcast
                +
                presence_score
                +
                dynamics_score
            )
            / 3

        )

        studio = self.clamp(

            (
                warmth_score
                +
                echo_score
                +
                noise_score
                +
                dynamics_score
            )
            / 4

        )

        overall = self.clamp(

            (
                studio
                +
                broadcast
                +
                streaming
                +
                consistency
            )
            / 4

        )

        return AudioScore(

            studio_readiness=studio,

            speech_intelligibility=intelligibility,

            warmth=warmth_score,

            presence=presence_score,

            noise=noise_score,

            echo=echo_score,

            dynamics=dynamics_score,

            consistency=consistency,

            broadcast=broadcast,

            streaming=streaming,

            overall=overall,

        )