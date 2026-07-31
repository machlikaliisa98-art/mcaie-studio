from dataclasses import dataclass
from pathlib import Path
import json
import datetime


@dataclass
class LearningRecord:

    timestamp: str

    before_score: float

    after_score: float

    improvement: float

    repaired_problems: list[str]

    repair_engines: list[str]


class MCAIELearning:

    """
    MCAIE Learning Engine

    Every processed recording teaches MCAIE
    which repair strategies produce the best
    studio-quality audio.

    This is the beginning of MCAIE Memory.
    """

    def __init__(self):

        self.database = Path(
            "storage/analysis/mcaie_learning.json"
        )

        self.database.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        if not self.database.exists():

            self.database.write_text("[]")

    def record(

        self,

        before_score,

        after_score,

        problems,

        repairs,

    ):

        history = json.loads(

            self.database.read_text()

        )

        history.append(

            LearningRecord(

                timestamp=datetime.datetime.utcnow().isoformat(),

                before_score=before_score,

                after_score=after_score,

                improvement=after_score-before_score,

                repaired_problems=problems,

                repair_engines=repairs,

            ).__dict__

        )

        self.database.write_text(

            json.dumps(

                history,

                indent=4,

            )

        )

    def history(self):

        return json.loads(

            self.database.read_text()

        )