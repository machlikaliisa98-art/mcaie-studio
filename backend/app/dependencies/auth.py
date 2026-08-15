from typing import Union

import os

from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPAuthorizationCredentials
from fastapi.security import HTTPBearer
from jose import JWTError
from jose import jwt

from app.database.session import SessionLocal
from app.models.creator import Creator
from app.models.listener import Listener


security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM")


def _decode_token(
    credentials: HTTPAuthorizationCredentials,
):
    """
    Decode and validate a FONS access token.
    """

    token = credentials.credentials

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=[JWT_ALGORITHM],
        )

        subject = payload.get("sub")

        if not subject:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication token.",
            )

        return str(subject)

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token.",
        )


def get_current_creator(
    credentials: HTTPAuthorizationCredentials = Depends(
        security,
    ),
):
    """
    Authenticate a creator.

    Supported creator token formats:

        creator:<creator_id>

    Legacy creator tokens are also supported:

        <creator_id>

    Listener tokens are rejected here.
    """

    subject = _decode_token(credentials)

    # ------------------------------------------------------
    # LISTENER TOKEN
    # ------------------------------------------------------

    if subject.startswith("listener:"):

        raise HTTPException(
            status_code=401,
            detail="Creator authentication required.",
        )

    # ------------------------------------------------------
    # CREATOR TOKEN
    # ------------------------------------------------------

    if subject.startswith("creator:"):

        try:

            creator_id = int(
                subject.split(
                    ":",
                    1,
                )[1]
            )

        except (ValueError, IndexError):

            raise HTTPException(
                status_code=401,
                detail="Invalid creator authentication token.",
            )

    else:

        # Backward compatibility with existing creator tokens
        try:

            creator_id = int(subject)

        except (TypeError, ValueError):

            raise HTTPException(
                status_code=401,
                detail="Creator authentication required.",
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

        if not creator.active:

            raise HTTPException(
                status_code=403,
                detail="Creator account is inactive.",
            )

        return creator

    finally:

        db.close()


def get_current_listener(
    credentials: HTTPAuthorizationCredentials = Depends(
        security,
    ),
):
    """
    Authenticate a listener.

    Listener tokens use:

        listener:<listener_id>

    Creator tokens are rejected here.
    """

    subject = _decode_token(credentials)

    if not subject.startswith("listener:"):

        raise HTTPException(
            status_code=401,
            detail="Listener authentication required.",
        )

    try:

        listener_id = int(
            subject.split(
                ":",
                1,
            )[1]
        )

    except (ValueError, IndexError):

        raise HTTPException(
            status_code=401,
            detail="Invalid listener authentication token.",
        )

    db = SessionLocal()

    try:

        listener = db.get(
            Listener,
            listener_id,
        )

        if listener is None:

            raise HTTPException(
                status_code=401,
                detail="Listener not found.",
            )

        if not listener.active:

            raise HTTPException(
                status_code=403,
                detail="Listener account is inactive.",
            )

        return listener

    finally:

        db.close()


def get_current_account(
    credentials: HTTPAuthorizationCredentials = Depends(
        security,
    ),
) -> Union[Creator, Listener]:
    """
    Authenticate either a Creator or Listener.

    Supported token formats:

        creator:<creator_id>
        listener:<listener_id>

    Legacy creator tokens using only the numeric creator ID
    are also supported for backward compatibility.
    """

    subject = _decode_token(credentials)

    db = SessionLocal()

    try:

        # ==================================================
        # LISTENER
        # ==================================================

        if subject.startswith("listener:"):

            try:

                listener_id = int(
                    subject.split(
                        ":",
                        1,
                    )[1]
                )

            except (ValueError, IndexError):

                raise HTTPException(
                    status_code=401,
                    detail="Invalid listener authentication token.",
                )

            listener = db.get(
                Listener,
                listener_id,
            )

            if listener is None:

                raise HTTPException(
                    status_code=401,
                    detail="Listener not found.",
                )

            if not listener.active:

                raise HTTPException(
                    status_code=403,
                    detail="Listener account is inactive.",
                )

            return listener

        # ==================================================
        # CREATOR
        # ==================================================

        if subject.startswith("creator:"):

            try:

                creator_id = int(
                    subject.split(
                        ":",
                        1,
                    )[1]
                )

            except (ValueError, IndexError):

                raise HTTPException(
                    status_code=401,
                    detail="Invalid creator authentication token.",
                )

        else:

            # ------------------------------------------------
            # Backward compatibility for existing creator JWTs
            # ------------------------------------------------

            try:

                creator_id = int(subject)

            except (TypeError, ValueError):

                raise HTTPException(
                    status_code=401,
                    detail="Invalid authentication token.",
                )

        creator = db.get(
            Creator,
            creator_id,
        )

        if creator is None:

            raise HTTPException(
                status_code=401,
                detail="Creator not found.",
            )

        if not creator.active:

            raise HTTPException(
                status_code=403,
                detail="Creator account is inactive.",
            )

        return creator

    finally:

        db.close()