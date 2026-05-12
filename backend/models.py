from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class Category(SQLModel, table=True):
    __tablename__ = "categories"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    parent_id: Optional[int] = Field(default=None, foreign_key="categories.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    videos: List["Video"] = Relationship(back_populates="category")


class Video(SQLModel, table=True):
    __tablename__ = "videos"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    url: str = Field(index=True)
    watched: bool = Field(default=False)
    category_id: int = Field(foreign_key="categories.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    category: Category = Relationship(back_populates="videos")
