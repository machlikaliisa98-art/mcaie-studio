from pathlib import Path
import json

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from app.config import OUTPUTS


router = APIRouter(
    prefix="/shows",
    tags=["Shows"],
)


SHOWS = OUTPUTS / "shows"


# ==========================================================
# HELPERS
# ==========================================================

def load_episode(metadata_file: Path) -> dict:
    """
    Load one published episode metadata file.
    """

    try:

        with open(
            metadata_file,
            encoding="utf-8",
        ) as file:

            data = json.load(file)

    except (json.JSONDecodeError, OSError) as exc:

        print(
            f"[SHOWS] Failed to read metadata: "
            f"{metadata_file}"
        )

        raise RuntimeError(
            f"Invalid episode metadata: {metadata_file}"
        ) from exc

    data.setdefault(
        "metadata_file",
        str(metadata_file),
    )

    return data


def episode_sort_key(
    episode: dict,
):
    """
    Sort episodes by season and episode number.
    """

    return (
        episode.get(
            "season",
            0,
        ),
        episode.get(
            "episode_number",
            0,
        ),
        episode.get(
            "episode",
            "",
        ),
    )


def collect_programmes(
    show_folder: Path,
):
    """
    Build:

    Programme
        Season
            Episode
    """

    programmes = []

    programmes_folder = (
        show_folder /
        "programmes"
    )

    if not programmes_folder.exists():

        return programmes

    for programme_folder in sorted(
        programmes_folder.iterdir(),
        key=lambda path: path.name.lower(),
    ):

        if not programme_folder.is_dir():
            continue

        programme_id = (
            programme_folder.name
        )

        programme_title = (
            programme_folder.name
            .replace(
                "-",
                " ",
            )
            .title()
        )

        seasons = []

        for season_folder in sorted(
            programme_folder.iterdir(),
            key=lambda path: path.name.lower(),
        ):

            if not season_folder.is_dir():
                continue

            season_id = (
                season_folder.name
            )

            season_title = (
                season_folder.name
                .replace(
                    "_",
                    " ",
                )
                .title()
            )

            episodes = []

            for metadata_file in sorted(
                season_folder.glob("*.json"),
                key=lambda path: path.name.lower(),
            ):

                try:

                    episode = load_episode(
                        metadata_file
                    )

                except RuntimeError:

                    # One damaged metadata file should
                    # not prevent the rest of the show
                    # from loading.
                    continue

                # --------------------------------------------------
                # Explicit hierarchy
                # --------------------------------------------------

                episode[
                    "programme_id"
                ] = programme_id

                episode[
                    "programme_title"
                ] = programme_title

                episode[
                    "season_id"
                ] = season_id

                episode[
                    "season_title"
                ] = episode.get(
                    "season_title",
                    season_title,
                )

                # --------------------------------------------------
                # Browser-accessible audio URL
                # --------------------------------------------------

                episode_number = episode.get(
                    "episode_number"
                )

                episode_identifier = episode.get(
                    "episode"
                )

                episode[
                    "audio_url"
                ] = (
                    f"/shows/"
                    f"{show_folder.name}/"
                    f"{programme_id}/"
                    f"{season_id}/"
                    f"{episode_identifier}/"
                    f"audio"
                )

                # --------------------------------------------------
                # Published audio filename
                # --------------------------------------------------

                audio_filename = episode.get(
                    "audio_filename"
                )

                if audio_filename:

                    episode[
                        "audio_filename"
                    ] = audio_filename

                episodes.append(
                    episode
                )

            episodes.sort(
                key=episode_sort_key
            )

            seasons.append(
                {
                    "id": season_id,

                    "title": season_title,

                    "season_number": (
                        episodes[0].get(
                            "season",
                            1,
                        )
                        if episodes
                        else 1
                    ),

                    "episodes": episodes,

                    "episode_count": len(
                        episodes
                    ),
                }
            )

        programmes.append(
            {
                "id": programme_id,

                "title": programme_title,

                "seasons": seasons,

                "season_count": len(
                    seasons
                ),

                "episode_count": sum(
                    len(
                        season[
                            "episodes"
                        ]
                    )
                    for season in seasons
                ),
            }
        )

    return programmes


def flatten_episodes(
    programmes,
):
    """
    Flatten:

    Programme
        Season
            Episode

    into:

    Episode
    Episode
    Episode

    This is useful for the main show page.
    """

    episodes = []

    for programme in programmes:

        for season in programme.get(
            "seasons",
            [],
        ):

            for original_episode in season.get(
                "episodes",
                [],
            ):

                episode = dict(
                    original_episode
                )

                episode.setdefault(
                    "programme_id",
                    programme["id"],
                )

                episode.setdefault(
                    "programme_title",
                    programme["title"],
                )

                episode.setdefault(
                    "season_id",
                    season["id"],
                )

                episode.setdefault(
                    "season_title",
                    season["title"],
                )

                episodes.append(
                    episode
                )

    episodes.sort(
        key=episode_sort_key
    )

    return episodes


# ==========================================================
# SHOW LIST
# ==========================================================

@router.get("/")
def get_shows():

    shows = []

    if not SHOWS.exists():

        return shows

    for folder in sorted(
        SHOWS.iterdir(),
        key=lambda path: path.name.lower(),
    ):

        if not folder.is_dir():
            continue

        programmes = collect_programmes(
            folder
        )

        episodes = flatten_episodes(
            programmes
        )

        shows.append(
            {
                "id": folder.name,

                "title": (
                    folder.name
                    .replace(
                        "-",
                        " ",
                    )
                    .title()
                ),

                "programmes": programmes,

                "episodes": episodes,

                "programme_count": len(
                    programmes
                ),

                "episode_count": len(
                    episodes
                ),
            }
        )

    return shows


# ==========================================================
# SHOW
# ==========================================================

@router.get("/{show}")
def get_show(
    show: str,
):

    folder = (
        SHOWS /
        show
    )

    if not folder.exists():

        raise HTTPException(
            status_code=404,
            detail="Show not found.",
        )

    if not folder.is_dir():

        raise HTTPException(
            status_code=404,
            detail="Show not found.",
        )

    programmes = collect_programmes(
        folder
    )

    episodes = flatten_episodes(
        programmes
    )

    return {
        "id": show,

        "title": (
            show
            .replace(
                "-",
                " ",
            )
            .title()
        ),

        "episodes": episodes,

        "episode_count": len(
            episodes
        ),

        "programmes": programmes,

        "programme_count": len(
            programmes
        ),
    }


# ==========================================================
# PROGRAMME
# ==========================================================

@router.get(
    "/{show}/{programme}"
)
def get_programme(
    show: str,
    programme: str,
):

    folder = (
        SHOWS /
        show /
        "programmes" /
        programme
    )

    if not folder.exists():

        raise HTTPException(
            status_code=404,
            detail="Programme not found.",
        )

    if not folder.is_dir():

        raise HTTPException(
            status_code=404,
            detail="Programme not found.",
        )

    seasons = []

    for season_folder in sorted(
        folder.iterdir(),
        key=lambda path: path.name.lower(),
    ):

        if not season_folder.is_dir():
            continue

        season_id = (
            season_folder.name
        )

        season_title = (
            season_folder.name
            .replace(
                "_",
                " ",
            )
            .title()
        )

        episodes = []

        for metadata_file in sorted(
            season_folder.glob("*.json"),
            key=lambda path: path.name.lower(),
        ):

            try:

                episode = load_episode(
                    metadata_file
                )

            except RuntimeError:

                continue

            episode[
                "programme_id"
            ] = programme

            episode[
                "programme_title"
            ] = programme.replace(
                "-",
                " ",
            ).title()

            episode[
                "season_id"
            ] = season_id

            episode.setdefault(
                "season_title",
                season_title,
            )

            episode_identifier = (
                episode.get(
                    "episode"
                )
            )

            episode[
                "audio_url"
            ] = (
                f"/shows/"
                f"{show}/"
                f"{programme}/"
                f"{season_id}/"
                f"{episode_identifier}/"
                f"audio"
            )

            episodes.append(
                episode
            )

        episodes.sort(
            key=episode_sort_key
        )

        seasons.append(
            {
                "id": season_id,

                "title": season_title,

                "season_number": (
                    episodes[0].get(
                        "season",
                        1,
                    )
                    if episodes
                    else 1
                ),

                "episodes": episodes,

                "episode_count": len(
                    episodes
                ),
            }
        )

    episodes = []

    for season in seasons:

        for original_episode in season[
            "episodes"
        ]:

            episode = dict(
                original_episode
            )

            episode.setdefault(
                "programme_id",
                programme,
            )

            episode.setdefault(
                "programme_title",
                programme.replace(
                    "-",
                    " ",
                ).title(),
            )

            episode.setdefault(
                "season_id",
                season["id"],
            )

            episode.setdefault(
                "season_title",
                season["title"],
            )

            episodes.append(
                episode
            )

    episodes.sort(
        key=episode_sort_key
    )

    return {
        "id": programme,

        "title": programme.replace(
            "-",
            " ",
        ).title(),

        "seasons": seasons,

        "episodes": episodes,

        "season_count": len(
            seasons
        ),

        "episode_count": len(
            episodes
        ),
    }


# ==========================================================
# SEASON
# ==========================================================

@router.get(
    "/{show}/{programme}/{season}"
)
def get_season(
    show: str,
    programme: str,
    season: str,
):

    folder = (
        SHOWS /
        show /
        "programmes" /
        programme /
        season
    )

    if not folder.exists():

        raise HTTPException(
            status_code=404,
            detail="Season not found.",
        )

    if not folder.is_dir():

        raise HTTPException(
            status_code=404,
            detail="Season not found.",
        )

    episodes = []

    for metadata_file in sorted(
        folder.glob("*.json"),
        key=lambda path: path.name.lower(),
    ):

        try:

            episode = load_episode(
                metadata_file
            )

        except RuntimeError:

            continue

        episode[
            "programme_id"
        ] = programme

        episode[
            "programme_title"
        ] = programme.replace(
            "-",
            " ",
        ).title()

        episode[
            "season_id"
        ] = season

        episode.setdefault(
            "season_title",
            season.replace(
                "_",
                " ",
            ).title(),
        )

        episode_identifier = (
            episode.get(
                "episode"
            )
        )

        episode[
            "audio_url"
        ] = (
            f"/shows/"
            f"{show}/"
            f"{programme}/"
            f"{season}/"
            f"{episode_identifier}/"
            f"audio"
        )

        episodes.append(
            episode
        )

    episodes.sort(
        key=episode_sort_key
    )

    return {
        "id": season,

        "title": season.replace(
            "_",
            " ",
        ).title(),

        "episodes": episodes,

        "episode_count": len(
            episodes
        ),
    }


# ==========================================================
# EPISODE AUDIO
# ==========================================================

@router.get(
    "/{show}/{programme}/{season}/{episode}/audio"
)
def get_episode_audio(
    show: str,
    programme: str,
    season: str,
    episode: str,
):
    """
    Stream a published episode through HTTP.

    The browser never needs to know the underlying
    D:\\MCAIE filesystem path.
    """

    season_folder = (
        SHOWS /
        show /
        "programmes" /
        programme /
        season
    )

    if not season_folder.exists():

        raise HTTPException(
            status_code=404,
            detail="Season not found.",
        )

    if not season_folder.is_dir():

        raise HTTPException(
            status_code=404,
            detail="Season not found.",
        )

    metadata_file = None

    # ------------------------------------------------------
    # Find the requested published episode.
    #
    # Supports:
    #
    # episode_000
    # episode_001
    # episode_002
    #
    # 001
    # 002
    # 003
    #
    # 001.wav
    # 002.wav
    # 003.wav
    # ------------------------------------------------------

    for candidate in season_folder.glob(
        "*.json"
    ):

        try:

            metadata = load_episode(
                candidate
            )

        except RuntimeError:

            continue

        if (
            metadata.get("episode")
            == episode
        ):

            metadata_file = candidate
            break

        if (
            metadata.get("audio_filename")
            == episode
        ):

            metadata_file = candidate
            break

        if (
            candidate.stem
            == episode
        ):

            metadata_file = candidate
            break

        if (
            candidate.stem
            == Path(
                episode
            ).stem
        ):

            metadata_file = candidate
            break

    if metadata_file is None:

        raise HTTPException(
            status_code=404,
            detail="Episode not found.",
        )

    metadata = load_episode(
        metadata_file
    )

    # ------------------------------------------------------
    # Resolve the actual published audio file.
    # ------------------------------------------------------

    audio_filename = metadata.get(
        "audio_filename"
    )

    if audio_filename:

        audio_path = (
            metadata_file.parent /
            audio_filename
        )

    else:

        configured_audio = metadata.get(
            "audio"
        )

        if not configured_audio:

            raise HTTPException(
                status_code=404,
                detail="Episode audio not found.",
            )

        audio_path = Path(
            configured_audio
        )

    # ------------------------------------------------------
    # Security:
    #
    # Make sure the final file actually exists.
    # ------------------------------------------------------

    if not audio_path.exists():

        raise HTTPException(
            status_code=404,
            detail="Episode audio not found.",
        )

    if not audio_path.is_file():

        raise HTTPException(
            status_code=404,
            detail="Episode audio not found.",
        )

    # ------------------------------------------------------
    # Stream WAV.
    # ------------------------------------------------------

    return FileResponse(
        path=audio_path,
        media_type="audio/wav",
        filename=audio_path.name,
    )