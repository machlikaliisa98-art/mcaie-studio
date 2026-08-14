import bcrypt


MAX_PASSWORD_BYTES = 72


def _password_bytes(password: str) -> bytes:
    """
    Convert a password to UTF-8 bytes and enforce bcrypt's
    72-byte maximum.
    """

    if not isinstance(password, str):
        raise TypeError("Password must be a string.")

    password_bytes = password.encode("utf-8")

    if len(password_bytes) > MAX_PASSWORD_BYTES:
        raise ValueError(
            "Password cannot be longer than 72 bytes."
        )

    return password_bytes


def hash_password(password: str) -> str:
    """
    Hash a plain-text password using bcrypt.
    """

    password_bytes = _password_bytes(password)

    hashed = bcrypt.hashpw(
        password_bytes,
        bcrypt.gensalt(),
    )

    return hashed.decode("utf-8")


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """
    Verify a plain-text password against a bcrypt hash.
    """

    try:
        password_bytes = _password_bytes(
            plain_password
        )

        hashed_bytes = hashed_password.encode(
            "utf-8"
        )

        return bcrypt.checkpw(
            password_bytes,
            hashed_bytes,
        )

    except (
        ValueError,
        TypeError,
        AttributeError,
    ):
        return False