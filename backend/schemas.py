from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime


class CategoryBase(BaseModel):
    name: str


class CategoryCreate(CategoryBase):
    parent_id: Optional[int] = None


class CategoryUpdate(BaseModel):
    name: Optional[str] = None


class CategoryRead(CategoryBase):
    id: int
    parent_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class CategoryTree(CategoryRead):
    children: List[CategoryRead] = []


class VideoBase(BaseModel):
    title: str
    url: str
    category_id: int

    @field_validator("url")
    @classmethod
    def validate_youtube_url(cls, v):
        if "youtube.com" not in v and "youtu.be" not in v:
            raise ValueError("URL must be a valid YouTube URL")
        return v


class VideoCreate(VideoBase):
    watched: bool = False


class VideoUpdate(BaseModel):
    title: Optional[str] = None
    url: Optional[str] = None
    watched: Optional[bool] = None
    category_id: Optional[int] = None


class VideoRead(VideoBase):
    id: int
    watched: bool
    created_at: datetime

    class Config:
        from_attributes = True


class CategoryProgress(BaseModel):
    category_id: int
    category_name: str
    total_videos: int
    watched_videos: int

    class Config:
        from_attributes = True


class DashboardData(BaseModel):
    total_parent_categories: int
    total_child_categories: int
    total_videos: int
    watched_videos: int
    progress_by_category: List[CategoryProgress]

    class Config:
        from_attributes = True
