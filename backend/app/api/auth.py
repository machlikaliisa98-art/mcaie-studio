from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy import or_
from sqlalchemy import select

from app.database.session import SessionLocal
from app.dependencies.auth import get_current_creator
from app.models.creator import Creator
from app.schemas.auth import LoginRequest
from app.schemas.creator import CreatorCreate
from app.security import (
    create_access_token,
    hash_password,
    verify_password,
)

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


@router.post("/register")
async def register(
    request: CreatorCreate,
):
    db = SessionLocal()

    try:

        #
        # Email already exists
        #

        existing = db.scalar(
            select(Creator).where(
                Creator.email == request.email
            )
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="Email already registered.",
            )

        #
        # Username already exists
        #

        existing = db.scalar(
            select(Creator).where(
                Creator.username == request.username
            )
        )

        if existing:
            raise HTTPException(
                status_code=409,
                detail="Username already taken.",
            )

        #
        # Create creator
        #

        creator = Creator(
            full_name=request.full_name,
            username=request.username,
            email=request.email,
            password_hash=hash_password(
                request.password,
            ),
            country=request.country,
            creator_category=request.creator_category,
        )

        db.add(creator)
        db.commit()
        db.refresh(creator)

        #
        # Create JWT
        #

        access_token = create_access_token(
            str(creator.id)
        )

        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "creator": {
                "id": creator.id,
                "full_name": creator.full_name,
                "username": creator.username,
                "email": creator.email,
                "country": creator.country,
                "creator_category": creator.creator_category,
                "verified": creator.verified,
                "active": creator.active,
            },
        }

    finally:
        db.close()


@router.post("/login")
async def login(
    request: LoginRequest,
):
    db = SessionLocal()

    try:

        #
        # Find creator using email OR username
        #

        creator = db.scalar(
            select(Creator).where(
                or_(
                    Creator.email == request.email,
                    Creator.username == request.email,
                )
            )
        )

        if creator is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or username.",
            )

        #
        # Verify password
        #

        if not verify_password(
            request.password,
            creator.password_hash,
        ):
            raise HTTPException(
                status_code=401,
                detail="Incorrect password.",
            )

        access_token = create_access_token(
            str(creator.id)
        )

        return {
            "success": True,
            "access_token": access_token,
            "token_type": "bearer",
            "creator": {
                "id": creator.id,
                "full_name": creator.full_name,
                "username": creator.username,
                "email": creator.email,
                "country": creator.country,
                "creator_category": creator.creator_category,
                "verified": creator.verified,
                "active": creator.active,
            },
        }

    finally:
        db.close()


@router.get("/me")
async def me(
    creator: Creator = Depends(
        get_current_creator,
    ),
):
    return {
        "id": creator.id,
        "full_name": creator.full_name,
        "username": creator.username,
        "email": creator.email,
        "country": creator.country,
        "creator_category": creator.creator_category,
        "verified": creator.verified,
        "active": creator.active,
        "created_at": creator.created_at,
    }