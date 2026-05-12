import os
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

# Use environment variable or default to local file
# On Render: set RENDER_DISK_PATH=/data or use relative path
DB_PATH = os.getenv("DATABASE_PATH", "data.db")
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(DATABASE_URL, echo=False)


def create_db_and_tables() -> None:
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session
