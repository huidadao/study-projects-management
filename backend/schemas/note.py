from pydantic import BaseModel
from typing import Optional


class NoteBase(BaseModel):
    video_id: int
    timestamp: int
    content: str


class NoteCreate(NoteBase):
    pass


class NoteUpdate(BaseModel):
    timestamp: Optional[int] = None
    content: Optional[str] = None


class NoteResponse(NoteBase):
    id: int
    created: str

    class Config:
        from_attributes = True