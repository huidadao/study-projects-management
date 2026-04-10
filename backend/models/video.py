from sqlmodel import SQLModel, Field
from typing import Optional
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