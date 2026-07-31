from fastapi import APIRouter

from app.services.dashboard import dashboard

router = APIRouter(

    prefix="/dashboard",

    tags=["Dashboard"],

)


@router.get("/")

def home():

    return dashboard.home()