from pathlib import Path
import shutil
import traceback

from app.engine.inspector import AudioInspector
from app.engine.preprocessor import AudioPreprocessor
from app.engine.vad import VoiceActivityDetector
from app.engine.intro_detector import IntroDetector
from app.engine.splitter import EpisodeSplitter

from app.engine.audio.mastering import AudioMaster
from app.engine.audio.normalizer import AudioNormalizer

from app.engine.ai.speech import (
    SpeechEngine,
    SpeechRequest,
)

from app.engine.ai.language import (
    LanguageEngine,
    LanguageRequest,
)

from app.services.knowledge import KnowledgeEngine

from app.api.jobs import (
    update_job,
    complete_job,
)

from app.services.projects import projects

from app.config import (
    PROCESSED,
)

from app.services.publishing import publisher

class ProductionPipeline:

    """
    MCAIE Production Pipeline v2

    Upload
        ↓
    Inspect
        ↓
    Normalize
        ↓
    Prepare
        ↓
    Voice Detection
        ↓
    Intro Detection
        ↓
    Split
        ↓
    Master
        ↓
    Publish (next)
        ↓
    AI (next)
    """

    def __init__(self):

        self.inspector = AudioInspector()

        self.normalizer = AudioNormalizer()

        self.preprocessor = AudioPreprocessor()

        self.vad = VoiceActivityDetector()

        self.intro = IntroDetector()

        self.splitter = EpisodeSplitter()

        self.master = AudioMaster()

        self.knowledge = KnowledgeEngine()

        self.speech = SpeechEngine()
        self.speech.initialize()

        self.language = LanguageEngine()
        self.language.initialize()

    def process(

        self,

        project_id: str,

        job_id: str,

        audio_file: str,

        mode: str = "podcast",

    ):

        print("\n" + "=" * 70)
        print("MCAIE PRODUCTION PIPELINE")
        print("=" * 70)

        processed_folder = PROCESSED / job_id

        processed_folder.mkdir(

            parents=True,

            exist_ok=True,

        )

        try:

            #
            # STEP 1
            #

            print("\nSTEP 1 - AUDIO INSPECTION")

            update_job(

                job_id,

                "Inspecting Audio",

                5,

            )

            projects.update(

                project_id,

                status="Inspecting Audio",

                progress=5,

            )

            self.inspector.inspect(

                audio_file,

            )

            #
            # STEP 2
            #

            print("\nSTEP 2 - AUDIO NORMALIZATION")

            update_job(

                job_id,

                "Normalizing Audio",

                10,

            )

            projects.update(

                project_id,

                status="Normalizing Audio",

                progress=10,

            )

            audio_file = self.normalizer.normalize(

                audio_file,

            )

            #
            # STUDIO MODE
            #

            if mode == "studio":

                print("\nSTEP 3 - STUDIO MASTER")

                update_job(

                    job_id,

                    "Studio Mastering",

                    35,

                )

                projects.update(

                    project_id,

                    status="Studio Mastering",

                    progress=35,

                )

                output = processed_folder / "studio_master.wav"

                self.master.process(

                    audio_file,

                    str(output),
                )

                print("\nSTEP 4 - TRANSCRIPTION")

                transcript = self.speech.transcribe(

                    SpeechRequest(

                        audio_file=str(output),

                    )

                )

                print("\n==============================")
                print("TRANSCRIPT")
                print("==============================")
                print(transcript.transcript)

                print("\nSTEP 5 - LANGUAGE ANALYSIS")

                keywords = self.language.process(

                    LanguageRequest(

                        task="keywords",

                        text=transcript.transcript,

                    )

                )

                topics = self.language.process(

                    LanguageRequest(

                        task="topics",

                        text=transcript.transcript,

                    )

                )

                summary = self.language.process(

                    LanguageRequest(

                        task="summary",

                        text=transcript.transcript,

                    )

                )

                print("\n==============================")
                print("SUMMARY")
                print("==============================")
                print(summary.result)

                print("\n==============================")
                print("TOPICS")
                print("==============================")
                print(topics.result)

                print("\n==============================")
                print("KEYWORDS")
                print("==============================")
                print(keywords.result)
                print()

                update_job(

                    job_id,

                    "Finalizing",

                    98,

                )

                projects.update(

                    project_id,

                    status="Completed",

                    progress=100,

                    published=True,

                )

                complete_job(

                    job_id,

                )

                print("\nSTUDIO COMPLETE")

                return

            #
            # PODCAST MODE
            #

            print("\nSTEP 3 - PREPARATION")

            update_job(

                job_id,

                "Preparing Audio",

                15,

            )

            projects.update(

                project_id,

                status="Preparing Audio",

                progress=15,

            )

            analysis_audio = self.preprocessor.create_analysis_audio(

                audio_file,

            )

            #
            # STEP 4
            #

            print("\nSTEP 4 - VOICE DETECTION")

            update_job(

                job_id,

                "Voice Detection",

                25,

            )

            projects.update(

                project_id,

                status="Voice Detection",

                progress=25,

            )

            self.vad.detect(

                analysis_audio,

            )

            #
            # STEP 5
            #

            print("\nSTEP 5 - INTRO DETECTION")

            intro_start = self.intro.detect(

                audio_file,

            )

            #
            # STEP 6
            #

            print("\nSTEP 6 - EPISODE SPLITTING")

            update_job(

                job_id,

                "Creating Episodes",

                40,

            )

            projects.update(

                project_id,

                status="Creating Episodes",

                progress=40,

            )

            episodes = self.splitter.split(

                audio_file=audio_file,

                job_id=job_id,

                trim_start=intro_start,

                episode_minutes=30,

            )

            total = len(

                episodes,

            )

            print(

                f"\nEpisodes Created: {total}"

            )

            if total == 0:

                raise RuntimeError(

                    "Episode splitter returned no episodes."

                )
            #
            # STEP 7
            #

            for index, episode in enumerate(

                episodes

            ):

                progress = 40 + int(

                    ((index + 1) / total) * 55

                )

                status = (

                    f"Mastering Episode "

                    f"{index + 1}/{total}"

                )

                update_job(

                    job_id,

                    status,

                    progress,

                )

                projects.update(

                    project_id,

                    status=status,

                    progress=progress,

                )

                output = (

                    processed_folder /

                    episode.name

                )

                print(

                    f"\nMastering "

                    f"{episode.name}"

                )

                try:

                    self.master.process(

                        str(episode),

                        str(output),

                    )

                                        #
                    # Speech Intelligence
                    #

                    speech = self.speech.transcribe(
                        SpeechRequest(
                            audio_file=str(output),
                        )
                    )

                    #
                    # Language Intelligence
                    #

                    summary = self.language.process(
                        LanguageRequest(
                            task="summary",
                            text=speech.transcript,
                        )
                    )

                    keywords = self.language.process(
                        LanguageRequest(
                            task="keywords",
                            text=speech.transcript,
                        )
                    )

                    topics = self.language.process(
                        LanguageRequest(
                            task="topics",
                            text=speech.transcript,
                        )
                    )

                    embedding = self.language.process(
                        LanguageRequest(
                            task="embeddings",
                            text=speech.transcript,
                        )
                    )

                    #
                    # Knowledge Engine
                    #

                    self.knowledge.save(

                        project_id=project_id,

                        episode_id=episode.stem,

                        transcript=speech.transcript,

                        summary=summary.result,

                        keywords=keywords.metadata["keywords"],

                        topics=topics.metadata["topics"],

                        embedding=embedding.metadata["embedding"],

                        metadata={

                            "language": speech.language,

                            "duration": speech.duration,

                            "confidence": speech.confidence,

                        },

                    )

                    #
                    # Publish to FONS Library
                    #

                    publisher.publish(
                        project_id=project_id,
                        episode=episode.stem,
                        title=episode.stem.replace("_", " "),
                        audio=str(output),
                        transcript=speech.transcript,
                        summary=summary.result,
                        duration=speech.duration,
                    )

                    print(

                        f"SUCCESS: "

                        f"{episode.name}"

                    )

                except Exception:

                    print(

                        "\nEpisode failed."

                    )

                    traceback.print_exc()

                    shutil.copy2(

                        episode,

                        output,

                    )

            #
            # STEP 8
            #

            print(

                "\nSTEP 8 - FINALIZING"

            )

            update_job(

                job_id,

                "Finalizing",

                98,

            )

            projects.update(

                project_id,

                status="Finalizing",

                progress=98,

            )

            #
            # Future hooks
            #
            # Speech Engine
            # Summaries
            # Chapters
            # Knowledge
            # Publishing
            # Recommendations
            #
            #
            # PIPELINE COMPLETE
            #

            projects.update(

                project_id,

                status="Completed",

                progress=100,

                published=True,

            )

            complete_job(

                job_id,

            )

            print("\nPIPELINE COMPLETE")

        except Exception:

            print("\nPIPELINE FAILED\n")

            traceback.print_exc()

            try:

                projects.update(

                    project_id,

                    status="Failed",

                    progress=100,

                )

            except Exception:

                traceback.print_exc()

            try:

                complete_job(

                    job_id,

                )

            except Exception:

                traceback.print_exc()