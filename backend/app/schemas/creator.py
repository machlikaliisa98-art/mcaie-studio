from pydantic import BaseModel, ConfigDict, EmailStr


class CreatorCreate(BaseModel):

    full_name: str

    username: str

    email: EmailStr

    password: str

    country: str

    creator_category: str


class CreatorResponse(BaseModel):

    id: int

    full_name: str

    username: str

    email: EmailStr

    country: str

    creator_category: str

    model_config = ConfigDict(
        from_attributes=True,
    )