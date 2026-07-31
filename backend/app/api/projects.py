from fastapi import APIRouter, HTTPException

from app.services.projects import projects

router = APIRouter(

    prefix="/projects",

    tags=["Projects"],

)


@router.get("/")

def get_projects():

    return projects.all()


@router.get("/{project_id}")

def get_project(

    project_id: str,

):

    try:

        return projects.load(project_id).__dict__

    except FileNotFoundError:

        raise HTTPException(

            status_code=404,

            detail="Project not found.",

        )


@router.patch("/{project_id}")

def update_project(

    project_id: str,

    updates: dict,

):

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


@router.delete("/{project_id}")

def delete_project(

    project_id: str,

):

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