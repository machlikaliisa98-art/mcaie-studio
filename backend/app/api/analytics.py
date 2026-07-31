from fastapi import APIRouter

from app.services.analytics import analytics

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"],
)


@router.get("/dashboard")
def dashboard():
    return analytics.dashboard()