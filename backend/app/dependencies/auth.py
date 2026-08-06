from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer
from jose import JWTError
from jose import jwt
import os

from app.database.session import SessionLocal
from app.models.creator import Creator

security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")


def get_current_creator(
    credentials: HTTPAuthorizationCredentials = Depends(
        security,
    ),
):

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )

        creator_id = int(
            payload["sub"]
        )

    except (JWTError, KeyError, ValueError):

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token.",
        )

    db = SessionLocal()

    try:

        creator = db.get(
            Creator,
            creator_id,
        )

        if creator is None:

            raise HTTPException(
                status_code=401,
                detail="Creator not found.",
            )

        return creator

    finally:

        db.close()