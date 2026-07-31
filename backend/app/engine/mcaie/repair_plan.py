from dataclasses import dataclass

from app.engine.mcaie.diagnostics import AudioProblem


@dataclass
class RepairAction:

    priority: int

    engine: str

    strength: float

    reason: str


class RepairPlanner:

    """
    MCAIE Repair Planning Engine

    Converts diagnostics into
    a prioritized repair strategy.
    """

    def build(

        self,

        problems: list[AudioProblem],

    ) -> list[RepairAction]:

        plan = []

        for problem in problems:

            if problem.name == "Electrical Hum":

                plan.append(

                    RepairAction(

                        1,

                        "HumRemover",

                        1.0,

                        problem.name,

                    )

                )

            elif problem.name == "Low Frequency Rumble":

                plan.append(

                    RepairAction(

                        2,

                        "HighPass",

                        0.8,

                        problem.name,

                    )

                )

            elif problem.name == "Background Hiss":

                plan.append(

                    RepairAction(

                        3,

                        "NoiseReduction",

                        problem.severity,

                        problem.name,

                    )

                )

            elif problem.name == "Room Echo":

                plan.append(

                    RepairAction(

                        4,

                        "Dereverb",

                        problem.severity,

                        problem.name,

                    )

                )

            elif problem.name == "Weak Speech Presence":

                plan.append(

                    RepairAction(

                        5,

                        "Presence",

                        0.75,

                        problem.name,

                    )

                )

            elif problem.name == "Harsh High Frequencies":

                plan.append(

                    RepairAction(

                        6,

                        "DynamicEQ",

                        0.60,

                        problem.name,

                    )

                )

            elif problem.name == "Excessive Dynamics":

                plan.append(

                    RepairAction(

                        7,

                        "Compressor",

                        0.70,

                        problem.name,

                    )

                )

        plan.sort(

            key=lambda action: action.priority

        )

        return plan