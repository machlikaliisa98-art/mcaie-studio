from dataclasses import dataclass
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

from app.config import PROCESSED

from app.services.publishing import publisher


@dataclass
class ProcessingOptions:

    # ==========================================================
    # AUDIO PROCESSING
    # ==========================================================

    enhance_audio: bool = False
    normalize_audio: bool = False

    # ==========================================================
    # AI PROCESSING
    # ==========================================================

    transcribe: bool = False
    summarize: bool = False
    keywords: bool = False
    topics: bool = False
    chapters: bool = False
    speaker_identification: bool = False

    # ==========================================================
    # EPISODE SPLITTING
    # ==========================================================

    split_audio: bool = False
    split_method: str = "fixed"
    split_minutes: int = 20

    # ==========================================================
    # PUBLISHING
    # ==========================================================

    publish_to: str = "download"

    # ==========================================================
    # PROGRAMME / SEASON
    # ==========================================================

    programme: str = ""
    season: int = 1

    # ==========================================================
    # AUDIO PRESERVATION
    # ==========================================================

    preserve_audio: bool = True


class ProductionPipeline:

    def __init__(self):

        # ======================================================
        # CORE ENGINES
        # ======================================================

        self.inspector = AudioInspector()
        self.normalizer = AudioNormalizer()
        self.preprocessor = AudioPreprocessor()
        self.vad = VoiceActivityDetector()
        self.intro = IntroDetector()
        self.splitter = EpisodeSplitter()
        self.master = AudioMaster()

        # ======================================================
        # LAZY AI ENGINES
        # ======================================================

        self.speech = None
        self.language = None
        self.knowledge = None

    # ==========================================================
    # LAZY AI INITIALIZATION
    # ==========================================================

    def _ensure_speech(self):

        if self.speech is None:

            print()
            print(
                "MCAIE: Initializing Speech Engine..."
            )

            self.speech = SpeechEngine()
            self.speech.initialize()

            print(
                "MCAIE: Speech Engine Ready."
            )

        return self.speech

    def _ensure_language(self):

        if self.language is None:

            print()
            print(
                "MCAIE: Initializing Language Engine..."
            )

            self.language = LanguageEngine()
            self.language.initialize()

            print(
                "MCAIE: Language Engine Ready."
            )

        return self.language

    def _ensure_knowledge(self):

        if self.knowledge is None:

            print()
            print(
                "MCAIE: Initializing Knowledge Engine..."
            )

            self.knowledge = KnowledgeEngine()

            print(
                "MCAIE: Knowledge Engine Ready."
            )

        return self.knowledge

    # ==========================================================
    # PROCESS
    # ==========================================================

    def process(
        self,
        project_id: str,
        job_id: str,
        audio_file: str,
        mode: str = "podcast",
        options: ProcessingOptions | None = None,
    ):

        if options is None:
            options = ProcessingOptions()

        print()
        print("=" * 70)
        print("MCAIE PRODUCTION PIPELINE")
        print("=" * 70)

        print()
        print("PROCESSING CONFIGURATION")
        print("-" * 70)

        print(
            f"Enhance Audio          : "
            f"{options.enhance_audio}"
        )

        print(
            f"Normalize Audio        : "
            f"{options.normalize_audio}"
        )

        print(
            f"Transcribe             : "
            f"{options.transcribe}"
        )

        print(
            f"Summarize              : "
            f"{options.summarize}"
        )

        print(
            f"Keywords               : "
            f"{options.keywords}"
        )

        print(
            f"Topics                 : "
            f"{options.topics}"
        )

        print(
            f"Chapters               : "
            f"{options.chapters}"
        )

        print(
            f"Speaker ID             : "
            f"{options.speaker_identification}"
        )

        print(
            f"Split Audio            : "
            f"{options.split_audio}"
        )

        print(
            f"Split Method           : "
            f"{options.split_method}"
        )

        print(
            f"Split Minutes          : "
            f"{options.split_minutes}"
        )

        print(
            f"Preserve Audio         : "
            f"{options.preserve_audio}"
        )

        print(
            f"Publish To             : "
            f"{options.publish_to}"
        )

        print(
            f"Programme              : "
            f"{options.programme or '(not specified)'}"
        )

        print(
            f"Season                 : "
            f"{options.season}"
        )

        print("-" * 70)

        # ======================================================
        # ENGINE REQUIREMENTS
        # ======================================================

        language_required = (
            options.summarize
            or options.keywords
            or options.topics
        )

        speech_required = (
            options.transcribe
            or language_required
            or options.chapters
            or options.speaker_identification
        )

        knowledge_required = (
            options.transcribe
            or language_required
        )

        print()
        print("ENGINE REQUIREMENTS")
        print("-" * 70)

        print(
            f"Speech Engine         : "
            f"{speech_required}"
        )

        print(
            f"Language Engine       : "
            f"{language_required}"
        )

        print(
            f"Knowledge Engine      : "
            f"{knowledge_required}"
        )

        print("-" * 70)

        # ======================================================
        # OUTPUT
        # ======================================================

        processed_folder = (
            PROCESSED /
            job_id
        )

        processed_folder.mkdir(
            parents=True,
            exist_ok=True,
        )

        try:

            # ==================================================
            # STEP 1
            # ==================================================

            print()
            print("STEP 1 - AUDIO INSPECTION")

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
                audio_file
            )

            # ==================================================
            # STEP 2
            # ==================================================

            if options.normalize_audio:

                print()
                print(
                    "STEP 2 - NORMALIZATION ENABLED"
                )

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

                audio_file = (
                    self.normalizer.normalize(
                        audio_file
                    )
                )

            else:

                print()
                print(
                    "STEP 2 - NORMALIZATION SKIPPED"
                )

            # ==================================================
            # STEP 3-5
            # ==================================================

            intro_start = 0.0

            if (
                options.split_audio
                and
                options.split_method.lower()
                == "ai"
            ):

                print()
                print(
                    "STEP 3 - AI AUDIO ANALYSIS"
                )

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

                analysis_audio = (
                    self.preprocessor
                    .create_analysis_audio(
                        audio_file
                    )
                )

                print()
                print(
                    "STEP 4 - VOICE DETECTION"
                )

                update_job(
                    job_id,
                    "Voice Detection",
                    20,
                )

                projects.update(
                    project_id,
                    status="Voice Detection",
                    progress=20,
                )

                self.vad.detect(
                    analysis_audio
                )

                print()
                print(
                    "STEP 5 - INTRO DETECTION"
                )

                update_job(
                    job_id,
                    "Detecting Intro",
                    25,
                )

                projects.update(
                    project_id,
                    status="Detecting Intro",
                    progress=25,
                )

                intro_start = (
                    self.intro.detect(
                        audio_file
                    )
                )

            else:

                print()
                print(
                    "STEP 3 - AI ANALYSIS SKIPPED"
                )

                print()
                print(
                    "STEP 4 - VOICE DETECTION SKIPPED"
                )

                print()
                print(
                    "STEP 5 - INTRO DETECTION SKIPPED"
                )

            # ==================================================
            # STEP 6
            # ==================================================

            if options.split_audio:

                print()
                print(
                    "STEP 6 - EPISODE SPLITTING"
                )

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

                episodes = (
                    self.splitter.split(
                        audio_file=audio_file,
                        job_id=job_id,
                        trim_start=intro_start,
                        episode_minutes=(
                            options.split_minutes
                        ),
                        preserve_audio=(
                            options.preserve_audio
                        ),
                    )
                )

            else:

                print()
                print(
                    "STEP 6 - EPISODE SPLITTING SKIPPED"
                )

                source = Path(
                    audio_file
                )

                output = (
                    processed_folder /
                    source.name
                )

                shutil.copy2(
                    source,
                    output,
                )

                episodes = [
                    output
                ]

            total = len(
                episodes
            )

            if total == 0:

                raise RuntimeError(
                    "No output episodes were produced."
                )

            print()
            print(
                f"OUTPUT FILES: {total}"
            )

            # ==================================================
            # STEP 7
            # ==================================================

            for index, episode in enumerate(
                episodes
            ):

                progress = (
                    40
                    +
                    int(
                        (
                            (index + 1)
                            /
                            total
                        )
                        * 50
                    )
                )

                print()
                print("=" * 60)

                print(
                    f"EPISODE "
                    f"{index + 1}/{total}"
                )

                print(
                    f"File: "
                    f"{episode.name}"
                )

                print("=" * 60)

                update_job(
                    job_id,
                    (
                        f"Processing Episode "
                        f"{index + 1}/{total}"
                    ),
                    progress,
                )

                projects.update(
                    project_id,
                    status=(
                        f"Processing Episode "
                        f"{index + 1}/{total}"
                    ),
                    progress=progress,
                )

                output = (
                    processed_folder /
                    episode.name
                )

                # ==============================================
                # AUDIO ENHANCEMENT
                # ==============================================

                if options.enhance_audio:

                    print(
                        "Audio enhancement: ENABLED"
                    )

                    self.master.process(
                        str(episode),
                        str(output),
                    )

                else:

                    print(
                        "Audio enhancement: DISABLED"
                    )

                    if (
                        Path(episode).resolve()
                        !=
                        output.resolve()
                    ):

                        shutil.copy2(
                            episode,
                            output,
                        )

                # ==============================================
                # TRANSCRIPTION
                # ==============================================

                speech = None

                if options.transcribe:

                    print(
                        "Transcription: ENABLED"
                    )

                    speech_engine = (
                        self._ensure_speech()
                    )

                    speech = (
                        speech_engine.transcribe(
                            SpeechRequest(
                                audio_file=str(
                                    output
                                )
                            )
                        )
                    )

                else:

                    print(
                        "Transcription: DISABLED"
                    )

                # ==============================================
                # LANGUAGE
                # ==============================================

                summary = None
                keywords = None
                topics = None

                if speech:

                    if options.summarize:

                        print(
                            "Summary: ENABLED"
                        )

                        language_engine = (
                            self._ensure_language()
                        )

                        summary = (
                            language_engine.process(
                                LanguageRequest(
                                    task="summary",
                                    text=(
                                        speech.transcript
                                    ),
                                )
                            )
                        )

                    else:

                        print(
                            "Summary: DISABLED"
                        )

                    if options.keywords:

                        print(
                            "Keywords: ENABLED"
                        )

                        language_engine = (
                            self._ensure_language()
                        )

                        keywords = (
                            language_engine.process(
                                LanguageRequest(
                                    task="keywords",
                                    text=(
                                        speech.transcript
                                    ),
                                )
                            )
                        )

                    else:

                        print(
                            "Keywords: DISABLED"
                        )

                    if options.topics:

                        print(
                            "Topics: ENABLED"
                        )

                        language_engine = (
                            self._ensure_language()
                        )

                        topics = (
                            language_engine.process(
                                LanguageRequest(
                                    task="topics",
                                    text=(
                                        speech.transcript
                                    ),
                                )
                            )
                        )

                    else:

                        print(
                            "Topics: DISABLED"
                        )

                else:

                    if options.summarize:

                        print(
                            "Summary requested "
                            "but transcription "
                            "is disabled."
                        )

                    if options.keywords:

                        print(
                            "Keywords requested "
                            "but transcription "
                            "is disabled."
                        )

                    if options.topics:

                        print(
                            "Topics requested "
                            "but transcription "
                            "is disabled."
                        )

                # ==============================================
                # CHAPTERS
                # ==============================================

                if options.chapters:

                    print(
                        "Chapters requested, "
                        "but no chapter engine is "
                        "currently connected."
                    )

                # ==============================================
                # SPEAKER IDENTIFICATION
                # ==============================================

                if options.speaker_identification:

                    print(
                        "Speaker identification "
                        "requested, but no speaker "
                        "engine is currently connected."
                    )

                # ==============================================
                # KNOWLEDGE
                # ==============================================

                if speech:

                    print(
                        "Knowledge Engine: ENABLED"
                    )

                    knowledge_engine = (
                        self._ensure_knowledge()
                    )

                    embedding = None

                    try:

                        language_engine = (
                            self._ensure_language()
                        )

                        embedding = (
                            language_engine.process(
                                LanguageRequest(
                                    task="embeddings",
                                    text=(
                                        speech.transcript
                                    ),
                                )
                            )
                        )

                    except Exception:

                        print(
                            "Embedding generation "
                            "unavailable."
                        )

                    knowledge_engine.save(

                        project_id=project_id,

                        episode_id=(
                            episode.stem
                        ),

                        transcript=(
                            speech.transcript
                        ),

                        summary=(
                            summary.result
                            if summary
                            else None
                        ),

                        keywords=(
                            keywords.metadata
                            if keywords
                            else None
                        ),

                        topics=(
                            topics.metadata
                            if topics
                            else None
                        ),

                        embedding=embedding,

                        metadata={
                            "language": (
                                speech.language
                            ),
                            "duration": (
                                speech.duration
                            ),
                            "confidence": (
                                speech.confidence
                            ),
                        },
                    )

                else:

                    print(
                        "Knowledge Engine: SKIPPED"
                    )

                # ==============================================
                # PUBLISHING
                # ==============================================

                if (
                    options.publish_to
                    and
                    options.publish_to.lower()
                    != "download"
                ):

                    show = (
                        options.publish_to
                    )

                    programme = (
                        options.programme.strip()
                        if options.programme
                        else "Untitled Programme"
                    )

                    season = (
                        options.season
                        if options.season >= 1
                        else 1
                    )

                    # ------------------------------------------
                    # IMPORTANT
                    #
                    # The publisher is now the authority for the
                    # permanent episode number.
                    #
                    # We therefore do NOT use index + 1 for the
                    # public title.
                    #
                    # The publisher returns the actual published
                    # episode number.
                    # ------------------------------------------

                    print()
                    print(
                        "Publishing episode..."
                    )

                    published = (
                        publisher.publish(

                            project_id=(
                                project_id
                            ),

                            episode=(
                                episode.stem
                            ),

                            # Temporary title.
                            # PublishingService will now use
                            # the real permanent episode number.
                            title=(
                                f"{programme} "
                                f"Season {season} "
                                f"Episode "
                                f"{index + 1}"
                            ),

                            audio=(
                                str(output)
                            ),

                            duration=(
                                (
                                    speech.duration
                                    if speech
                                    else 0.0
                                )
                            ),

                            show=(
                                show
                            ),

                            programme=(
                                programme
                            ),

                            season=(
                                season
                            ),

                            episode_number=(
                                index + 1
                            ),

                            transcript=(
                                (
                                    speech.transcript
                                    if speech
                                    else ""
                                )
                            ),

                            summary=(
                                (
                                    summary.result
                                    if summary
                                    else ""
                                )
                            ),
                        )
                    )

                    print()
                    print(
                        "PUBLISHED EPISODE:"
                    )

                    print(
                        f"Episode Number : "
                        f"{published.episode_number}"
                    )

                    print(
                        f"Episode Title  : "
                        f"{published.title}"
                    )

                else:

                    print(
                        "Publishing: "
                        "DOWNLOAD ONLY"
                    )

                print()
                print(
                    f"SUCCESS: "
                    f"{episode.name}"
                )

            # ==================================================
            # STEP 8
            # ==================================================

            print()
            print(
                "STEP 8 - FINALIZING"
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

            projects.update(
                project_id,
                status="Completed",
                progress=100,
                published=True,
            )

            complete_job(
                job_id
            )

            print()
            print("=" * 70)
            print(
                "MCAIE PIPELINE COMPLETE"
            )
            print("=" * 70)

        except Exception:

            print()
            print("=" * 70)
            print(
                "MCAIE PIPELINE FAILED"
            )
            print("=" * 70)

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
                    job_id
                )

            except Exception:

                traceback.print_exc()