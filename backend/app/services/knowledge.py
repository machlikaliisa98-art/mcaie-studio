from pathlib import Path
from datetime import datetime
import json
import numpy as np

from app.config import (
    PROJECTS,
)


class KnowledgeEngine:

    """
    MCAIE Knowledge Engine v1

    Responsible for permanently storing
    every piece of intelligence generated
    by MCAIE.

    This becomes the foundation for:

    • Search

    • Recommendations

    • AI Chat

    • Audience Intelligence

    • Creator Analytics

    • Streaming Platform
    """

    def save(

        self,

        project_id: str,

        episode_id: str,

        transcript: str,

        summary: str,

        keywords,

        topics,

        embedding,

        metadata=None,

    ):

        project = PROJECTS / project_id

        knowledge = project / "knowledge"

        embeddings = project / "embeddings"

        transcripts = project / "transcripts"

        summaries = project / "summaries"

        keywords_folder = project / "keywords"

        topics_folder = project / "topics"

        metadata_folder = project / "metadata"

        for folder in (

            knowledge,

            embeddings,

            transcripts,

            summaries,

            keywords_folder,

            topics_folder,

            metadata_folder,

        ):

            folder.mkdir(

                parents=True,

                exist_ok=True,

            )

        #
        # Transcript
        #

        (

            transcripts /

            f"{episode_id}.txt"

        ).write_text(

            transcript,

            encoding="utf-8",

        )

        #
        # Summary
        #

        (

            summaries /

            f"{episode_id}.txt"

        ).write_text(

            summary,

            encoding="utf-8",

        )

        #
        # Keywords
        #

        with open(

            keywords_folder /

            f"{episode_id}.json",

            "w",

            encoding="utf-8",

        ) as file:

            json.dump(

                keywords,

                file,

                indent=4,

            )

        #
        # Topics
        #

        with open(

            topics_folder /

            f"{episode_id}.json",

            "w",

            encoding="utf-8",

        ) as file:

            json.dump(

                topics,

                file,

                indent=4,

            )

        #
        # Embedding
        #

        np.save(

            embeddings /

            f"{episode_id}.npy",

            np.asarray(

                embedding,

                dtype=np.float32,

            ),

        )

        #
        # Metadata
        #

        data = {

            "episode_id": episode_id,

            "project_id": project_id,

            "created": datetime.utcnow().isoformat(),

            "transcript":

                f"transcripts/{episode_id}.txt",

            "summary":

                f"summaries/{episode_id}.txt",

            "keywords":

                f"keywords/{episode_id}.json",

            "topics":

                f"topics/{episode_id}.json",

            "embedding":

                f"embeddings/{episode_id}.npy",

        }

        if metadata:

            data.update(metadata)

        with open(

            metadata_folder /

            f"{episode_id}.json",

            "w",

            encoding="utf-8",

        ) as file:

            json.dump(

                data,

                file,

                indent=4,

            )

        #
        # Knowledge Record
        #

        with open(

            knowledge /

            f"{episode_id}.json",

            "w",

            encoding="utf-8",

        ) as file:

            json.dump(

                data,

                file,

                indent=4,

            )

        print(

            f"[MCAIE] Knowledge stored for {episode_id}"

        )

        return data