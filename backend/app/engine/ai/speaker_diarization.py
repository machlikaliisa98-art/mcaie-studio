from dataclasses import dataclass
from pathlib import Path
import json

from pyannote.audio import Pipeline


@dataclass
class SpeakerSegment:

    speaker: str
    start: float
    end: float
    duration: float


class AISpeakerDiarization:

    def __init__(self, hf_token: str):

        if not hf_token:
            raise ValueError(
                "HF_TOKEN was not found. Please set HF_TOKEN in your .env file."
            )

        self.pipeline = Pipeline.from_pretrained(
            "pyannote/speaker-diarization-3.1",
            token=hf_token,
        )

    def diarize(
        self,
        audio_file: str,
    ) -> list[SpeakerSegment]:

        diarization = self.pipeline(audio_file)

        segments = []

        for turn, _, speaker in diarization.itertracks(
            yield_label=True,
        ):

            segments.append(

                SpeakerSegment(

                    speaker=str(speaker),

                    start=float(turn.start),

                    end=float(turn.end),

                    duration=float(turn.end - turn.start),

                )

            )

        return segments

    def export(
        self,
        segments,
        output: Path,
    ):

        output.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        output.write_text(
            json.dumps(
                [
                    segment.__dict__
                    for segment in segments
                ],
                indent=4,
            )
        )