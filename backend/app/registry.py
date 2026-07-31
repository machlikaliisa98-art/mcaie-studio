from typing import Dict

from .base import AIEngine


class EngineRegistry:

    def __init__(self):

        self._engines: Dict[str, AIEngine] = {}

    def register(

        self,

        engine: AIEngine,

    ):

        self._engines[engine.name] = engine

    def get(

        self,

        name: str,

    ) -> AIEngine:

        return self._engines[name]

    def all(self):

        return list(self._engines.values())


registry = EngineRegistry()