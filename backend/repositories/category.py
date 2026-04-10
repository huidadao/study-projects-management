from models.category import Category
from repositories.base import BaseRepository
from sqlmodel import Session


class CategoryRepository(BaseRepository[Category]):
    def __init__(self, session: Session):
        super().__init__(Category, session)