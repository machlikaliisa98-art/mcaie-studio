from dataclasses import dataclass
from pathlib import Path
import json


@dataclass
class AudioMemory:

    fingerprint: list[float]

    room_type: str

    noise_level: str

    repair_plan: list[str]

    improvement: float


class MCAIEMemory:

    """
    MCAIE Memory Engine

    Stores successful repair strategies.

    Future versions will search for
    similar recordings and reuse
    strategies that previously worked.
    """

    def __init__(self):

        self.database = Path(
            "storage/analysis/mcaie_memory.json"
        )

        self.database.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        if not self.database.exists():

            self.database.write_text("[]")

    def remember(

        self,

        memory: AudioMemory,

    ):

        history = json.loads(

            self.database.read_text()

        )

        history.append(

            memory.__dict__

        )

        self.database.write_text(

            json.dumps(

                history,

                indent=4,

            )

        )

    def all(self):

        return json.loads(

            self.database.read_text()

        )

    def closest(

        self,

        fingerprint,

    ):

        history = self.all()

        if not history:

            return None

        best = None

        distance = 1e12

        for item in history:

            fp = item["fingerprint"]

            score = sum(

                abs(

                    a-b

                )

                for a, b in zip(

                    fingerprint,

                    fp,

                )

            )

            if score < distance:

                distance = score

                best = item

        return best