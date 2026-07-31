from dataclasses import dataclass

from app.engine.mcaie.score import MCAIEScore


@dataclass
class ValidationResult:

    improved: bool

    before_score: float

    after_score: float

    improvement: float

    recommendation: str


class MCAIEValidator:

    """
    MCAIE Validation Engine

    Every repair must be measurable.

    The engine never assumes that
    processing improved the audio.
    It verifies.
    """

    def __init__(self):

        self.scorer = MCAIEScore()

    def validate(

        self,

        before_audio: str,

        after_audio: str,

    ) -> ValidationResult:

        before = self.scorer.score(

            before_audio,

        )

        after = self.scorer.score(

            after_audio,

        )

        gain = (

            after.overall

            -

            before.overall

        )

        improved = gain > 0

        if gain > 20:

            recommendation = (

                "Studio quality achieved."

            )

        elif gain > 10:

            recommendation = (

                "Excellent improvement."

            )

        elif gain > 3:

            recommendation = (

                "Good improvement."

            )

        elif gain > 0:

            recommendation = (

                "Minor improvement."

            )

        else:

            recommendation = (

                "Reprocess using different strategy."

            )

        return ValidationResult(

            improved=improved,

            before_score=before.overall,

            after_score=after.overall,

            improvement=gain,

            recommendation=recommendation,

        )