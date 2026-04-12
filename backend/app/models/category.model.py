from typing import Optional
from sqlmodel import Field, SQLModel, Relationship


class Category(SQLModel, table=True):
    __tablename__ = "categories"
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str = Field(
        index=True, unique=True, description="The display name of the category."
    )
    description: Optional[str] = Field(default=None, index=True)
    parent_id: Optional[int] = Field(
        default=None, foreign_key="categories.id", index=True
    )

    # Relationship to parent category (Self-referencing)
    parent: Optional["Category"] = Relationship(back_populates="children")

    # Relationship to children
    children: list["Category"] = Relationship(back_populates="parent")

    # IMPORTANT: Ensure naming convention respects unique constraint for children
    # We must enforce composite uniqueness at the ORM level/database level if the backend logic requires it.
