from dataclasses import dataclass, field
from typing import Dict, List

import numpy as np
from sentence_transformers import SentenceTransformer

from .base import AIEngine


@dataclass
class EmbeddingRequest:

    project_id: str

    text: str

    metadata: Dict = field(default_factory=dict)


@dataclass
class EmbeddingResponse:

    success: bool

    vector: List[float]

    dimensions: int

    metadata: Dict = field(default_factory=dict)


class EmbeddingEngine(AIEngine):

    """
    MCAIE Semantic Embedding Engine

    Responsible for transforming text
    into semantic vectors used by:

    • Memory

    • Semantic Search

    • Recommendations

    • AI Chat

    • Topic Clustering

    • Related Content
    """

    name = "Embedding Engine"

    version = "2.0.0"

    _model = None

    def initialize(self):

        if EmbeddingEngine._model is None:

            print("[MCAIE] Loading Embedding Model...")

            EmbeddingEngine._model = SentenceTransformer(

                "all-MiniLM-L6-v2"

            )

            print("[MCAIE] Embedding Model Ready.")

    def shutdown(self):

        print("[MCAIE] Embedding Engine stopped.")

    def process(

        self,

        data: EmbeddingRequest,

    ) -> EmbeddingResponse:

        return self.embed(data)

    def embed(

        self,

        request: EmbeddingRequest,

    ) -> EmbeddingResponse:

        vector = EmbeddingEngine._model.encode(

            request.text,

            normalize_embeddings=True,

        )

        return EmbeddingResponse(

            success=True,

            vector=vector.tolist(),

            dimensions=len(vector),

            metadata=request.metadata,

        )

    def similarity(

        self,

        vector_a: List[float],

        vector_b: List[float],

    ) -> float:

        a = np.asarray(

            vector_a,

            dtype=np.float32,

        )

        b = np.asarray(

            vector_b,

            dtype=np.float32,

        )

        denominator = (

            np.linalg.norm(a)

            *

            np.linalg.norm(b)

        )

        if denominator == 0:

            return 0.0

        return float(

            np.dot(a, b)

            /

            denominator

        )