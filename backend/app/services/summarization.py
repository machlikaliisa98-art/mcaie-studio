from dataclasses import dataclass
from pathlib import Path

from app.engine.ai.language import (
    LanguageEngine,
    LanguageRequest,
    LanguageResponse,
)


@dataclass
class Summary:

    project_id: str

    executive: str

    plain_language: str

    confidence: float


class SummarizationService:

    """
    MCAIE Summarization Service

    Responsibilities

    • Executive Summary
    • Plain-language Summary
    • Future multilingual summaries

    This service orchestrates the
    Language Engine.
    """

    def __init__(self):

        self.engine = LanguageEngine()

        self.engine.initialize()

    def summarize(

        self,

        project_id: str,

        transcript: str,

    ) -> Summary:

        executive: LanguageResponse = self.engine.process(

            LanguageRequest(

                task="summary",

                text=transcript,

            )

        )

        plain: LanguageResponse = self.engine.process(

            LanguageRequest(

                task="plain_language",

                text=transcript,

            )

        )

        return Summary(

            project_id=project_id,

            executive=executive.result,

            plain_language=plain.result,

            confidence=min(

                executive.confidence,

                plain.confidence,

            ),

        )

    def shutdown(self):

        self.engine.shutdown()


summarizer = SummarizationService()