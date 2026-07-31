from dataclasses import dataclass
import subprocess

from app.config import FFMPEG


@dataclass
class NoiseProfile:

    floor_db: float

    hum_probability: float

    hiss_probability: float

    wind_probability: float

    traffic_probability: float

    crowd_probability: float

    music_probability: float

    keyboard_probability: float

    fan_probability: float

    severity: str


class NoiseProfiler:

    def profile(

        self,

        audio_file: str,

    ) -> NoiseProfile:

        process = subprocess.run(

            [

                FFMPEG,

                "-i",

                audio_file,

                "-af",

                "volumedetect",

                "-f",

                "null",

                "-",

            ],

            capture_output=True,

            text=True,

        )

        stderr = process.stderr

        floor = -40.0

        for line in stderr.splitlines():

            if "mean_volume:" in line:

                floor = float(

                    line.split(":")[-1]

                    .replace(" dB", "")

                    .strip()

                )

        if floor < -34:

            severity = "high"

        elif floor < -27:

            severity = "medium"

        else:

            severity = "low"

        hum = 0.15
        hiss = 0.20
        wind = 0.10
        traffic = 0.10
        crowd = 0.10
        music = 0.05
        keyboard = 0.05
        fan = 0.15

        if severity == "high":

            hum += 0.20
            hiss += 0.20
            fan += 0.20

        elif severity == "medium":

            hum += 0.10
            hiss += 0.10

        return NoiseProfile(

            floor_db=floor,

            hum_probability=hum,

            hiss_probability=hiss,

            wind_probability=wind,

            traffic_probability=traffic,

            crowd_probability=crowd,

            music_probability=music,

            keyboard_probability=keyboard,

            fan_probability=fan,

            severity=severity,

        )