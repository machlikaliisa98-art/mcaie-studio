from dataclasses import dataclass
from pathlib import Path

from app.engine.ai.speech import (
    SpeechEngine,
    SpeechRequest,
    SpeechResponse,
)


@dataclass
class Transcript:

    audio_file: str

    language: str

    duration: float

    transcript: str

    confidence: float


class TranscriptionService:

    """
    MCAIE Transcription Service

    Responsibilities

    • Validate audio
    • Send audio to Speech Engine
    • Return transcript
    • Save transcript (future)
    """

    def __init__(self):

        self.engine = SpeechEngine()

        self.engine.initialize()

    def transcribe(

        self,

        audio_file: str,

    ) -> Transcript:

        file = Path(audio_file)

        if not file.exists():

            raise FileNotFoundError(audio_file)

        response: SpeechResponse = self.engine.process(

            SpeechRequest(

                audio_file=str(file),

            )

        )

        return Transcript(

            audio_file=str(file),

            language=response.language,

            duration=response.duration,

            transcript=response.transcript,

            confidence=response.confidence,

        )

    def shutdown(self):

        self.engine.shutdown()


transcription = TranscriptionService()