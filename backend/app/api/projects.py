from fastapi import APIRouter, HTTPException

from app.services.projects import projects


router = APIRouter(
    prefix="/projects",
    tags=["Projects"],
)


# ==========================================================
# PROJECT LIST
# ==========================================================

@router.get("")
def get_projects():
    """
    Return all projects.

    The route intentionally uses an empty path because the
    router already has the /projects prefix.

    This means:
        GET /projects

    works directly without a trailing-slash redirect.
    """

    return projects.all()


# ==========================================================
# LATEST PROJECT
# ==========================================================

# MUST COME BEFORE /{project_id}

@router.get("/latest")
def latest_project():
    """
    Return the most recently available project.
    """

    data = projects.all()

    if not data:
        raise HTTPException(
            status_code=404,
            detail="No projects found.",
        )

    return data[0]


# ==========================================================
# SINGLE PROJECT
# ==========================================================

@router.get("/{project_id}")
def get_project(
    project_id: str,
):
    """
    Return a single project by ID.
    """

    try:

        project = projects.load(
            project_id,
        )

        return project.__dict__

    except FileNotFoundError:

        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )


# ==========================================================
# UPDATE PROJECT
# ==========================================================

@router.patch("/{project_id}")
def update_project(
    project_id: str,
    updates: dict,
):
    """
    Update an existing project.
    """

    try:

        project = projects.update(
            project_id,
            **updates,
        )

        return project.__dict__

    except FileNotFoundError:

        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )


# ==========================================================
# DELETE PROJECT
# ==========================================================

@router.delete("/{project_id}")
def delete_project(
    project_id: str,
):
    """
    Permanently remove a project file.
    """

    from app.config import PROJECTS

    file = PROJECTS / f"{project_id}.json"

    if not file.exists():

        raise HTTPException(
            status_code=404,
            detail="Project not found.",
        )

    file.unlink()

    return {
        "deleted": project_id,
    }