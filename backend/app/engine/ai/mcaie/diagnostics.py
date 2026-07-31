from dataclasses import dataclass

from app.engine.mcaie.analysis import MCAIEAnalysis
from app.engine.mcaie.spectrum import SpectrumAnalyzer
from app.engine.mcaie.voiceprint import VoicePrintAnalyzer
from app.engine.mcaie.noise import NoiseAnalyzer
from app.engine.mcaie.room import RoomAnalyzer


@dataclass
class AudioProblem:

    name: str

    severity: float

    recommendation: str


class AudioDiagnostics:

    def __init__(self):

        self.analysis = MCAIEAnalysis()

        self.spectrum = SpectrumAnalyzer()

        self.voice = VoicePrintAnalyzer()

        self.noise = NoiseAnalyzer()

        self.room = RoomAnalyzer()

    def inspect(

        self,

        audio_file: str,

    ):

        analysis = self.analysis.analyze(audio_file)

        spectrum = self.spectrum.analyze(audio_file)

        voice = self.voice.analyze(audio_file)

        noise = self.noise.analyze(audio_file)

        room = self.room.analyze(audio_file)

        problems = []

        if noise.hiss_score > 0.12:

            problems.append(

                AudioProblem(

                    "Background Hiss",

                    noise.hiss_score,

                    "Apply adaptive denoising",

                )

            )

        if noise.hum_score > 0.08:

            problems.append(

                AudioProblem(

                    "Electrical Hum",

                    noise.hum_score,

                    "Apply notch filtering",

                )

            )

        if noise.rumble_score > 0.15:

            problems.append(

                AudioProblem(

                    "Low Frequency Rumble",

                    noise.rumble_score,

                    "Increase high-pass cutoff",

                )

            )

        if room.reverb_score > 0.18:

            problems.append(

                AudioProblem(

                    "Room Echo",

                    room.reverb_score,

                    "Increase dereverberation",

                )

            )

        if spectrum.mid_energy < 0.45:

            problems.append(

                AudioProblem(

                    "Weak Speech Presence",

                    1 - spectrum.mid_energy,

                    "Boost vocal frequencies",

                )

            )

        if analysis.dynamic_range > 22:

            problems.append(

                AudioProblem(

                    "Excessive Dynamics",

                    analysis.dynamic_range,

                    "Increase compression",

                )

            )

        if voice.brightness > 0.35:

            problems.append(

                AudioProblem(

                    "Harsh High Frequencies",

                    voice.brightness,

                    "Reduce upper spectrum",

                )

            )

        return problems