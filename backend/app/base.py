from abc import ABC, abstractmethod
from typing import Any


class AIEngine(ABC):

    """
    Base class for every MCAIE AI engine.

    Every AI capability in the platform
    derives from this class.
    """

    name: str = "AI Engine"

    version: str = "1.0"

    @abstractmethod
    def initialize(self):

        pass

    @abstractmethod
    def process(

        self,

        data: Any,

    ) -> Any:

        pass

    @abstractmethod
    def shutdown(self):

        pass