from dataclasses import dataclass
import subprocess

from app.config import FFMPEG


@dataclass
class RoomProfile:

    room_type: str

    reverb_score: float

    echo_score: float

    ambience_score: float

    reflection_score: float

    treatment_score: float

    confidence: float


class RoomProfiler:

    def profile(

        self,

        audio_file: str,

    ) -> RoomProfile:

        process = subprocess.run(

            [

                FFMPEG,

                "-i",

                audio_file,

                "-af",

                "astats=metadata=1:reset=1",

                "-f",

                "null",

                "-",

            ],

            capture_output=True,

            text=True,

        )

        stderr = process.stderr.lower()

        room = "office"

        reverb = 0.35

        echo = 0.30

        ambience = 0.30

        reflection = 0.30

        treatment = 0.60

        confidence = 0.75

        if "clipping" in stderr:

            reflection += 0.15

        if "peak_level" in stderr:

            confidence += 0.05

        if reverb > 0.70:

            room = "hall"

        elif reverb > 0.45:

            room = "meeting room"

        elif reverb < 0.15:

            room = "treated studio"

            treatment = 0.95

        return RoomProfile(

            room_type=room,

            reverb_score=reverb,

            echo_score=echo,

            ambience_score=ambience,

            reflection_score=reflection,

            treatment_score=treatment,

            confidence=confidence,

        )