from dataclasses import dataclass, field
from typing import Dict, List
from pathlib import Path
import json
import numpy as np

from .base import AIEngine
from app.config import PROJECTS


@dataclass
class MemoryRecord:

    project_id: str

    source: str

    category: str

    content: str

    metadata: Dict = field(default_factory=dict)


@dataclass
class MemoryQuery:

    text: str

    limit: int = 10

    metadata: Dict = field(default_factory=dict)


@dataclass
class MemoryResult:

    success: bool

    records: List[MemoryRecord]

    metadata: Dict = field(default_factory=dict)


class MemoryEngine(AIEngine):

    """
    MCAIE Memory Intelligence Engine

    The Memory Engine is the retrieval
    layer for the Knowledge Engine.

    It never owns data.

    It loads knowledge records,
    summaries and embeddings so that
    Search, Recommendations and AI Chat
    can consume them.
    """

    name = "Memory Engine"

    version = "2.1.0"

    def initialize(self):

        print("[MCAIE] Memory Engine Ready.")

    def shutdown(self):

        print("[MCAIE] Memory Engine stopped.")

    def process(self, data):

        return data

    def store(

        self,

        record: MemoryRecord,

    ):

        #
        # Permanent storage belongs
        # to the Knowledge Engine.
        #

        return True

    def search(

        self,

        query: MemoryQuery,

    ) -> MemoryResult:

        project_id = query.metadata.get(

            "project_id"

        )

        if not project_id:

            return MemoryResult(

                success=False,

                records=[],

                metadata={

                    "error": "project_id missing"

                },

            )

        project = PROJECTS / project_id

        knowledge = project / "knowledge"

        records = []

        if not knowledge.exists():

            return MemoryResult(

                success=True,

                records=[],

                metadata={

                    "count": 0,

                },

            )

        for file in knowledge.glob("*.json"):

            try:

                with open(

                    file,

                    "r",

                    encoding="utf-8",

                ) as f:

                    data = json.load(f)

                #
                # Load summary
                #

                summary = ""

                summary_file = project / data.get(

                    "summary",

                    "",

                )

                if summary_file.exists():

                    summary = summary_file.read_text(

                        encoding="utf-8",

                    )

                #
                # Load transcript
                #

                transcript = ""

                transcript_file = project / data.get(

                    "transcript",

                    "",

                )

                if transcript_file.exists():

                    transcript = transcript_file.read_text(

                        encoding="utf-8",

                    )

                #
                # Load embedding
                #

                embedding_vector = []

                embedding_file = project / data.get(

                    "embedding",

                    "",

                )

                if embedding_file.exists():

                    embedding_vector = np.load(

                        embedding_file,

                    ).tolist()

                #
                # Enrich metadata
                #

                data["embedding_vector"] = embedding_vector

                data["summary_text"] = summary

                data["transcript_text"] = transcript

                records.append(

                    MemoryRecord(

                        project_id=project_id,

                        source=data.get(

                            "episode_id",

                            file.stem,

                        ),

                        category="episode",

                        content=summary,

                        metadata=data,

                    )

                )

            except Exception as e:

                print(

                    f"[Memory] Failed loading {file.name}: {e}"

                )

                continue

        return MemoryResult(

            success=True,

            records=records[:query.limit],

            metadata={

                "count": len(records),

                "project_id": project_id,

            },

        )