from sqlmodel import Session, SQLModel, select
from typing import Generic, TypeVar, Type, Optional, List

ModelType = TypeVar("ModelType", bound=SQLModel)


class BaseRepository(Generic[ModelType]):
    def __init__(self, model: Type[ModelType], session: Session):
        self.model = model
        self.session = session

    def get_all(self) -> List[ModelType]:
        return list(self.session.exec(select(self.model)).all())
    
    def get_by_id(self, id: int) -> Optional[ModelType]:
        return self.session.get(self.model, id)
    
    def create(self, obj: ModelType) -> ModelType:
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj
    
    def update(self, obj: ModelType) -> ModelType:
        self.session.add(obj)
        self.session.commit()
        self.session.refresh(obj)
        return obj
    
    def delete(self, id: int) -> bool:
        obj = self.get_by_id(id)
        if obj:
            self.session.delete(obj)
            self.session.commit()
            return True
        return False