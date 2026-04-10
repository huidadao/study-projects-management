from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, TYPE_CHECKING
from datetime import datetime


class Video(SQLModel, table=True):
    __tablename__ = "videos"

    id: Optional[int] = Field(default=None, primary_key=True)
    url: str
    title: str
    channel: Optional[str] = None
    duration: Optional[int] = None
    thumbnail: Optional[str] = None
    watched: bool = Field(default=False)
    created: str = Field(default_factory=lambda: datetime.now().isoformat())


class VideoCategoryLink(SQLModel, table=True):
    __tablename__ = "video_categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="videos.id")
    category_id: int = Field(foreign_key="categories.id")
