from pydantic import BaseModel


class ListenerCreate(BaseModel):

    full_name: str

    username: str

    email: str

    password: str

    country: str