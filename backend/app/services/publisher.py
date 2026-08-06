from dataclasses import dataclass
from typing import Any


@dataclass(slots=True)
class PublishResult:
    conversation: Any
    episodes: list[Any]
    assets: list[Any]


class Publisher:
    """
    Converts a processed conversation into
    FONS publishing objects.

    This class owns the publishing business rules.

    It does NOT perform AI processing.
    """

    def __init__(
        self,
        conversation_repository: Any,
        series_repository: Any,
        episode_repository: Any,
        asset_repository: Any,
    ):
        self.conversations = conversation_repository
        self.series = series_repository
        self.episodes = episode_repository
        self.assets = asset_repository

    async def publish(
        self,
        production: Any,
        request: Any,
    ) -> PublishResult:
        """
        Publish a processed conversation.
        """

        # Create Conversation
        conversation = await self.conversations.create(
            creator_id=request.creator_id,
            show_id=request.show_id,
            series_id=request.series_id,
            title=request.title,
            description=request.description,
            language=request.language,
        )

        # Episodes
        episodes = []

        if request.split_episodes:
            episodes = await self.episodes.create_from_segments(
                conversation=conversation,
                segments=production.episodes,
            )

        # Assets
        assets = await self.assets.register(
            conversation=conversation,
            production=production,
        )

        return PublishResult(
            conversation=conversation,
            episodes=episodes,
            assets=assets,
        )