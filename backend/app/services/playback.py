from dataclasses import dataclass
from datetime import datetime
from typing import Dict


@dataclass
class PlaybackState:

    project_id: str

    episode: str

    current_position: float

    duration: float

    completed: bool

    last_played: str


class PlaybackService:

    """
    MCAIE Playback Engine

    Responsible for:

    • Resume Listening

    • Continue Listening

    • Playback History

    • Listening Progress

    • Recently Played

    • Queue Support
    """

    def __init__(self):

        self.sessions: Dict[str, PlaybackState] = {}

    def update(

        self,

        project_id: str,

        episode: str,

        position: float,

        duration: float,

    ):

        completed = position >= duration * 0.95

        self.sessions[episode] = PlaybackState(

            project_id=project_id,

            episode=episode,

            current_position=position,

            duration=duration,

            completed=completed,

            last_played=datetime.utcnow().isoformat(),

        )

    def get(

        self,

        episode: str,

    ):

        return self.sessions.get(episode)

    def continue_listening(self):

        return sorted(

            self.sessions.values(),

            key=lambda x: x.last_played,

            reverse=True,

        )


playback = PlaybackService()