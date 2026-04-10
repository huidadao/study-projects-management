from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import List

from models.category import Category
from repositories.category import CategoryRepository
from schemas.category import CategoryCreate, CategoryUpdate, CategoryResponse

router = APIRouter()


def get_session():
    from main import engine
    with Session(engine) as session:
        yield session


@router.get("", response_model=List[CategoryResponse])
async def get_categories(session: Session = Depends(get_session)):
    """Get all categories"""
    repo = CategoryRepository(session)
    return repo.get_all()


@router.post("", response_model=CategoryResponse, status_code=201)
async def create_category(category: CategoryCreate, session: Session = Depends(get_session)):
    """Create a new category"""
    repo = CategoryRepository(session)
    db_category = Category(**category.model_dump())
    created = repo.create(db_category)
    return created


@router.get("/{category_id}", response_model=CategoryResponse)
async def get_category(category_id: int, session: Session = Depends(get_session)):
    """Get a single category by ID"""
    repo = CategoryRepository(session)
    category = repo.get_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category


@router.put("/{category_id}", response_model=CategoryResponse)
async def update_category(category_id: int, category_update: CategoryUpdate, session: Session = Depends(get_session)):
    """Update a category"""
    repo = CategoryRepository(session)
    category = repo.get_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = category_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(category, key, value)
    
    updated = repo.update(category)
    return updated


@router.delete("/{category_id}", response_model=CategoryResponse)
async def delete_category(category_id: int, session: Session = Depends(get_session)):
    """Delete a category"""
    repo = CategoryRepository(session)
    category = repo.get_by_id(category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    repo.delete(category_id)
    return category