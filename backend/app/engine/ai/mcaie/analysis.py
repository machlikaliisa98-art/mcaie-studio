from dataclasses import dataclass
import subprocess
import numpy as np

from app.config import FFMPEG
from app.engine.audio.decoder import AudioDecoder


@dataclass
class AudioAnalysis:

    duration: float
    sample_rate: int
    channels: int
    bit_depth: int
    mean_volume: float
    peak_volume: float
    dynamic_range: float
    speech_ratio: float
    silence_ratio: float


class MCAIEAnalysis:

    SAMPLE_SECONDS = 30

    def __init__(self):

        self.decoder = AudioDecoder()

    def analyze(

        self,

        audio_file: str,

    ) -> AudioAnalysis:

        #
        # Universal decoding
        #

        signal, sample_rate = self.decoder.decode(

            audio_file

        )

        channels = 1

        bit_depth = 16

        duration = len(signal) / sample_rate

        #
        # Analyze only the first SAMPLE_SECONDS
        #

        max_samples = sample_rate * self.SAMPLE_SECONDS

        signal = signal[:max_samples]

        frame = int(sample_rate * 0.03)

        hop = int(sample_rate * 0.015)

        energies = []

        for i in range(

            0,

            len(signal) - frame,

            hop,

        ):

            block = signal[i:i + frame]

            energies.append(

                np.sqrt(

                    np.mean(

                        block ** 2

                    )

                )

            )

        energies = np.asarray(

            energies,

            dtype=np.float32,

        )

        threshold = max(

            energies.mean() * 0.45,

            0.02,

        )

        speech_ratio = float(

            np.mean(

                energies > threshold

            )

        )

        silence_ratio = 1.0 - speech_ratio

        command = [

            FFMPEG,

            "-hide_banner",

            "-nostats",

            "-t",

            str(self.SAMPLE_SECONDS),

            "-i",

            audio_file,

            "-af",

            "volumedetect",

            "-f",

            "null",

            "-",

        ]

        process = subprocess.run(

            command,

            capture_output=True,

            text=True,

            timeout=120,

        )

        mean = -24.0

        peak = -2.0

        for line in process.stderr.splitlines():

            if "mean_volume:" in line:

                mean = float(

                    line.split(":")[-1]

                    .replace(" dB", "")

                    .strip()

                )

            elif "max_volume:" in line:

                peak = float(

                    line.split(":")[-1]

                    .replace(" dB", "")

                    .strip()

                )

        dynamic = peak - mean

        return AudioAnalysis(

            duration=duration,

            sample_rate=sample_rate,

            channels=channels,

            bit_depth=bit_depth,

            mean_volume=mean,

            peak_volume=peak,

            dynamic_range=dynamic,

            speech_ratio=speech_ratio,

            silence_ratio=silence_ratio,

        )