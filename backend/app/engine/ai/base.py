from abc import ABC, abstractmethod


class AIEngine(ABC):
    """
    Base class for all MCAIE AI engines.
    """

    name = "AI Engine"
    version = "1.0.0"

    @abstractmethod
    def initialize(self):
        """Initialize the engine."""
        pass

    @abstractmethod
    def shutdown(self):
        """Release any resources."""
        pass

    @abstractmethod
    def process(self, data):
        """Process a request."""
        pass