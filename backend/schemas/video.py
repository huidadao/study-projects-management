from pydantic import BaseModel, HttpUrl
from typing import Optional


class VideoBase(BaseModel):
    url: HttpUrl
    title: str
    channel: Optional[str] = None
    duration: Optional[int] = None
    thumbnail: Optional[str] = None
    watched: bool = False


class VideoCreate(VideoBase):
    pass


class VideoUpdate(BaseModel):
    url: Optional[HttpUrl] = None
    title: Optional[str] = None
    channel: Optional[str] = None
    duration: Optional[int] = None
    thumbnail: Optional[str] = None
    watched: Optional[bool] = None


class VideoResponse(VideoBase):
    id: int
    created: str

    class Config:
        from_attributes = True