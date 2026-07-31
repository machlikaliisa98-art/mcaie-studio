from dataclasses import dataclass
from typing import List

from app.services.projects import projects


@dataclass
class Analytics:

    total_projects: int

    completed_projects: int

    processing_projects: int

    failed_projects: int

    total_episodes: int

    transcripts_ready: int

    summaries_ready: int

    published_projects: int


class AnalyticsService:

    """
    MCAIE Analytics Service

    Platform analytics derived
    from real project data.

    No mock data.
    """

    def dashboard(self) -> Analytics:

        data = projects.all()

        total = len(data)

        completed = sum(

            1

            for p in data

            if p.get("status") == "Completed"

        )

        processing = sum(

            1

            for p in data

            if p.get("status") not in (

                "Completed",

                "Failed",

            )

        )

        failed = sum(

            1

            for p in data

            if p.get("status") == "Failed"

        )

        episodes = sum(

            p.get(

                "episode_count",

                0,

            )

            for p in data

        )

        transcripts = sum(

            1

            for p in data

            if p.get(

                "transcript_ready",

                False,

            )

        )

        summaries = sum(

            1

            for p in data

            if p.get(

                "summary_ready",

                False,

            )

        )

        published = sum(

            1

            for p in data

            if p.get(

                "published",

                False,

            )

        )

        return Analytics(

            total_projects=total,

            completed_projects=completed,

            processing_projects=processing,

            failed_projects=failed,

            total_episodes=episodes,

            transcripts_ready=transcripts,

            summaries_ready=summaries,

            published_projects=published,

        )


analytics = AnalyticsService()