from dataclasses import dataclass, field
from typing import Dict

from faster_whisper import WhisperModel

from .base import AIEngine


@dataclass
class SpeechRequest:

    audio_file: str

    language: str | None = None

    metadata: Dict = field(default_factory=dict)


@dataclass
class SpeechResponse:

    success: bool

    transcript: str

    language: str

    duration: float

    confidence: float

    metadata: Dict = field(default_factory=dict)


class SpeechEngine(AIEngine):

    """
    MCAIE Speech Intelligence Engine

    Local Speech Recognition
    Faster-Whisper
    Offline
    """

    name = "Speech Engine"

    version = "2.1.0"

    _model = None

    def __init__(self):

        self.initialize()

    def initialize(self):

        if SpeechEngine._model is not None:

            return

        print("\n[MCAIE] Loading Speech Model...")

        SpeechEngine._model = WhisperModel(

            "base",

            device="cpu",

            compute_type="int8",

        )

        print("[MCAIE] Speech Model Ready.\n")

    def shutdown(self):

        print("[MCAIE] Speech Engine stopped.")

    def process(

        self,

        data: SpeechRequest,

    ) -> SpeechResponse:

        return self.transcribe(data)

    def transcribe(

        self,

        request: SpeechRequest,

    ) -> SpeechResponse:

        #
        # Safety
        #

        if SpeechEngine._model is None:

            self.initialize()

        segments, info = SpeechEngine._model.transcribe(

            request.audio_file,

            language=request.language,

            vad_filter=True,

            beam_size=5,

        )

        transcript = []

        confidences = []

        for segment in segments:

            transcript.append(

                segment.text.strip()

            )

            if hasattr(

                segment,

                "avg_logprob",

            ):

                confidences.append(

                    segment.avg_logprob

                )

        text = " ".join(

            transcript

        ).strip()

        confidence = 0.0

        if confidences:

            confidence = (

                sum(confidences)

                / len(confidences)

            )

        return SpeechResponse(

            success=True,

            transcript=text,

            language=info.language,

            duration=info.duration,

            confidence=confidence,

            metadata={

                "language_probability":

                info.language_probability,

            },

        )