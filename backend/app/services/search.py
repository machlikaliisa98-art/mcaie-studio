from dataclasses import dataclass
from typing import List

from app.engine.ai.embeddings import (
    EmbeddingEngine,
    EmbeddingRequest,
)

from app.engine.ai.memory import (
    MemoryEngine,
    MemoryQuery,
    MemoryRecord,
)


@dataclass
class SearchResult:

    project_id: str

    score: float

    title: str

    snippet: str

    timestamp: float


class SearchService:

    """
    MCAIE Semantic Search

    Searches ideas,
    not just words.
    """

    def __init__(self):

        self.embedding = EmbeddingEngine()

        self.memory = MemoryEngine()

        self.embedding.initialize()

        self.memory.initialize()

    def search(

        self,

        project_id: str,

        query: str,

        limit: int = 10,

    ) -> List[SearchResult]:

        #
        # Embed the query
        #

        query_embedding = self.embedding.process(

            EmbeddingRequest(

                project_id=project_id,

                text=query,

            )

        )

        #
        # Retrieve project memory
        #

        memory = self.memory.search(

            MemoryQuery(

                text=query,

                limit=limit,

                metadata={

                    "project_id": project_id,

                },

            )

        )

        results = []

        #
        # Score every memory
        #

        for record in memory.records:

            vector = record.metadata.get(

                "embedding_vector"

            )

            if not vector:

                continue

            score = self.embedding.similarity(

                query_embedding.vector,

                vector,

            )

            results.append(

                SearchResult(

                    project_id=record.project_id,

                    score=score,

                    title=record.source,

                    snippet=record.content[:300],

                    timestamp=record.metadata.get(

                        "created",

                        0,

                    ),

                )

            )

        results.sort(

            key=lambda x: x.score,

            reverse=True,

        )

        return results[:limit]

    def shutdown(self):

        self.embedding.shutdown()

        self.memory.shutdown()


search = SearchService()