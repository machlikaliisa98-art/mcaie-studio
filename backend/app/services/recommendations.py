from dataclasses import dataclass
from typing import List

from app.engine.ai.embeddings import (
    EmbeddingEngine,
    EmbeddingRequest,
)

from app.engine.ai.memory import (
    MemoryEngine,
    MemoryQuery,
)


@dataclass
class Recommendation:

    project_id: str

    title: str

    score: float

    reason: str


class RecommendationService:

    """
    MCAIE Recommendation Service

    Responsibilities

    • Similar Episodes
    • Continue Listening
    • Suggested Next Episode
    • Personalized Recommendations
    • Related Discussions
    """

    def __init__(self):

        self.embedding = EmbeddingEngine()

        self.memory = MemoryEngine()

        self.embedding.initialize()

        self.memory.initialize()

    def recommend(

        self,

        project_id: str,

        transcript: str,

        limit: int = 10,

    ) -> List[Recommendation]:

        embedding = self.embedding.process(

            EmbeddingRequest(

                project_id=project_id,

                text=transcript,

            )

        )

        related = self.memory.search(

            MemoryQuery(

                text=transcript,

                limit=limit,

            )

        )

        #
        # Recommendation ranking
        # will be implemented here.
        #

        raise NotImplementedError(

            "Recommendation engine not implemented."

        )

    def shutdown(self):

        self.embedding.shutdown()

        self.memory.shutdown()


recommendations = RecommendationService()