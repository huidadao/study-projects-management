from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Category(SQLModel, table=True):
    __tablename__ = "categories"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    category_type: str = Field(default="major")  # "major" or "minor"
    created: str = Field(default_factory=lambda: datetime.now().isoformat())