from fastapi import APIRouter
from fastapi import HTTPException

from sqlalchemy import or_
from sqlalchemy import select

from app.database.session import SessionLocal
from app.models.listener import Listener
from app.schemas.listener import ListenerCreate
from app.security import (
    create_access_token,
    hash_password,
)


router = APIRouter(
    prefix="/listeners",
    tags=["Listeners"],
)


@router.post("/register")
async def register_listener(
    request: ListenerCreate,
):
    """
    Register a real FONS listener account.
    """

    db = SessionLocal()

    try:

        existing = db.scalar(
            select(Listener).where(
                or_(
                    Listener.email == request.email,
                    Listener.username == request.username,
                )
            )
        )

        if existing:

            if existing.email == request.email:
                raise HTTPException(
                    status_code=409,
                    detail="Email already registered.",
                )

            raise HTTPException(
                status_code=409,
                detail="Username already taken.",
            )

        listener = Listener(
            full_name=request.full_name,
            username=request.username,
            email=request.email,
            password_hash=hash_password(
                request.password,
            ),
            country=request.country,
        )

        db.add(listener)
        db.commit()
        db.refresh(listener)

        access_token = create_access_token(
            f"listener:{listener.id}"
        )

        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "account_type": "listener",
            "listener": {
                "id": listener.id,
                "full_name": listener.full_name,
                "username": listener.username,
                "email": listener.email,
                "country": listener.country,
                "active": listener.active,
            },
        }

    finally:

        db.close()