from dataclasses import dataclass, field
from typing import Dict, List

import re
import numpy as np

from keybert import KeyBERT
from sentence_transformers import SentenceTransformer

from transformers import pipeline

from .base import AIEngine


@dataclass
class LanguageRequest:

    task: str

    text: str

    metadata: Dict = field(default_factory=dict)


@dataclass
class LanguageResponse:

    success: bool

    task: str

    result: str

    confidence: float

    metadata: Dict = field(default_factory=dict)


class LanguageEngine(AIEngine):

    """
    ======================================================

                MCAIE LANGUAGE ENGINE

    ======================================================

    Responsibilities

    • Semantic Embeddings

    • Keyword Extraction

    • Topic Extraction

    • Summarization

    • Knowledge Generation

    • Semantic Search

    • Recommendation Intelligence

    ======================================================
    """

    name = "Language Engine"

    version = "3.0.0"

    #
    # Singleton AI Models
    #

    _embedding_model = None

    _keyword_model = None

    _summarizer = None

    def initialize(self):

        #
        # Embedding Model
        #

        if self.__class__._embedding_model is None:

            print("[MCAIE] Loading Embedding Model...")

            self.__class__._embedding_model = (

                SentenceTransformer(

                    "all-MiniLM-L6-v2"

                )

            )

            print("[MCAIE] Embedding Model Ready.")

        #
        # KeyBERT
        #

        if self.__class__._keyword_model is None:

            print("[MCAIE] Loading Keyword Model...")

            self.__class__._keyword_model = KeyBERT(

                self.__class__._embedding_model

            )

            print("[MCAIE] Keyword Model Ready.")

        #
        # Summarizer
        #

        if self.__class__._summarizer is None:

            print("[MCAIE] Loading Summarization Model...")

            self.__class__._summarizer = pipeline(

                "summarization",

                model="sshleifer/distilbart-cnn-12-6",

            )

            print("[MCAIE] Summarization Model Ready.")

        print("[MCAIE] Language Engine Ready.")

    def shutdown(self):

        print("[MCAIE] Language Engine stopped.")

    def process(

        self,

        request: LanguageRequest,

    ) -> LanguageResponse:

        task = request.task.lower()

        if task == "keywords":

            return self.extract_keywords(

                request.text

            )

        elif task == "topics":

            return self.extract_topics(

                request.text

            )

        elif task == "summary":

            return self.summarize(

                request.text

            )

        elif task == "embeddings":

            return self.embeddings(

                request.text

            )

        raise ValueError(

            f"Unsupported task: {task}"

        )

    #
    # Utilities
    #

    def sentences(

        self,

        text: str,

    ) -> List[str]:

        return [

            sentence.strip()

            for sentence in re.split(

                r"[.!?]+",

                text,

            )

            if sentence.strip()

        ]

    def embedding_vector(

        self,

        text: str,

    ):

        return self.__class__._embedding_model.encode(

            text,

            normalize_embeddings=True,

        )
            #
    # Embeddings
    #

    def embeddings(

        self,

        text: str,

    ) -> LanguageResponse:

        vector = self.embedding_vector(

            text,

        )

        return LanguageResponse(

            success=True,

            task="embeddings",

            result="Embedding generated.",

            confidence=1.0,

            metadata={

                "dimension": int(len(vector)),

                "embedding": vector.tolist(),

            },

        )

    #
    # Semantic Keywords
    #

    def extract_keywords(

        self,

        text: str,

    ) -> LanguageResponse:

        keywords = self.__class__._keyword_model.extract_keywords(

            text,

            keyphrase_ngram_range=(1, 3),

            stop_words="english",

            top_n=15,

            use_mmr=True,

            diversity=0.6,

        )

        values = [

            keyword

            for keyword, score

            in keywords

        ]

        return LanguageResponse(

            success=True,

            task="keywords",

            result=", ".join(values),

            confidence=0.95,

            metadata={

                "keywords": values,

                "scores": {

                    keyword: float(score)

                    for keyword, score

                    in keywords

                },

            },

        )

    #
    # Topics
    #

    def extract_topics(

        self,

        text: str,

    ) -> LanguageResponse:

        keywords = self.extract_keywords(

            text,

        ).metadata["keywords"]

        topics = keywords[:5]

        return LanguageResponse(

            success=True,

            task="topics",

            result=", ".join(topics),

            confidence=0.90,

            metadata={

                "topics": topics,

            },

        )

    #
    # Semantic Summary
    #

    def summarize(

        self,

        text: str,

    ) -> LanguageResponse:

        clean = " ".join(

            self.sentences(text)

        )

        #
        # HuggingFace models
        # have token limits.
        #

        if len(clean) > 3500:

            clean = clean[:3500]

        summary = self.__class__._summarizer(

            clean,

            max_length=180,

            min_length=60,

            do_sample=False,

        )[0]["summary_text"]

        return LanguageResponse(

            success=True,

            task="summary",

            result=summary,

            confidence=0.94,

            metadata={

                "characters": len(clean),

            },

        )