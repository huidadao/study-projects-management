from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Note(SQLModel, table=True):
    __tablename__ = "notes"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="videos.id")
    timestamp: int  # seconds into video
    content: str
    created: str = Field(default_factory=lambda: datetime.now().isoformat())