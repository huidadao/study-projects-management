from pydantic import BaseModel, field_validator
from typing import Optional


class CategoryBase(BaseModel):
    name: str
    category_type: str = "major"


class CategoryCreate(CategoryBase):
    @field_validator('category_type')
    @classmethod
    def validate_category_type(cls, v: str) -> str:
        if v not in ('major', 'minor'):
            raise ValueError('category_type must be either "major" or "minor"')
        return v


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    category_type: Optional[str] = None

    @field_validator('category_type')
    @classmethod
    def validate_category_type(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ('major', 'minor'):
            raise ValueError('category_type must be either "major" or "minor"')
        return v


class CategoryResponse(CategoryBase):
    id: int
    created: str

    class Config:
        from_attributes = True