from sqlalchemy import text

from app.database.connection import engine

with engine.connect() as connection:
    version = connection.execute(
        text("SELECT version();")
    ).scalar()

print(version)