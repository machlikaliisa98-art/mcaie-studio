from silero_vad import (
    load_silero_vad,
    get_speech_timestamps,
)

import soundfile as sf
import torch


class VoiceActivityDetector:

    def __init__(self):

        self.model = load_silero_vad()

    def detect(

        self,

        wav_file: str,

    ):

        audio, sr = sf.read(wav_file)

        if len(audio.shape) > 1:

            audio = audio[:, 0]

        audio = torch.tensor(
            audio,
            dtype=torch.float32,
        )

        speech = get_speech_timestamps(

            audio,

            self.model,

            sampling_rate=16000,

            threshold=0.50,

            min_speech_duration_ms=700,

            min_silence_duration_ms=500,

            speech_pad_ms=250,

        )

        results = []

        for s in speech:

            results.append(

                (

                    s["start"] / 16000,

                    s["end"] / 16000,

                )

            )

        return results