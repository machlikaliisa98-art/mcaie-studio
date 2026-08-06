from dataclasses import dataclass
from pathlib import Path
from typing import Any


@dataclass(slots=True)
class PublishRequest:
    creator_id: str
    show_id: str | None
    series_id: str | None

    title: str
    description: str

    language: str

    publish: bool = True

    split_episodes: bool = True
    episode_duration: int = 15

    metadata: dict | None = None


class PublishingOrchestrator:
    """
    Coordinates the entire publishing workflow.

    It does not perform AI.

    It does not perform database logic.

    It simply coordinates the workflow.
    """

    def __init__(
        self,
        pipeline: Any,
        publisher: Any,
        library: Any,
        search: Any,
    ):
        self.pipeline = pipeline
        self.publisher = publisher
        self.library = library
        self.search = search

    async def publish(
        self,
        audio_path: Path,
        request: PublishRequest,
    ):
        # 1. Process through MCAIE
        production = await self.pipeline.process(
            audio_path=audio_path,
            metadata=request.metadata or {},
        )

        # 2. Publish conversation
        conversation = await self.publisher.publish(
            production=production,
            request=request,
        )

        # 3. Organize creator library
        await self.library.refresh(
            creator_id=request.creator_id,
        )

        # 4. Refresh search
        await self.search.index(
            conversation.id,
        )

        return conversation