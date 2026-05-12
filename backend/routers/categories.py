from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from typing import List
from database import get_session
from models import Category
from schemas import CategoryCreate, CategoryUpdate, CategoryRead, CategoryTree

router = APIRouter(prefix="/categories", tags=["categories"])


def get_descendant_ids(session: Session, category_id: int) -> list[int]:
    """Get all descendant category IDs including the parent itself."""
    result = [category_id]
    children = session.exec(
        select(Category.id).where(Category.parent_id == category_id)
    ).all()
    for child_id in children:
        result.extend(get_descendant_ids(session, child_id))
    return result


@router.post("/", response_model=CategoryRead, status_code=201)
def create_category(category: CategoryCreate, session: Session = Depends(get_session)):
    if category.parent_id:
        parent = session.get(Category, category.parent_id)
        if not parent:
            raise HTTPException(status_code=404, detail="Parent category not found")

    query = select(Category).where(Category.name == category.name)
    if category.parent_id:
        query = query.where(Category.parent_id == category.parent_id)
    else:
        query = query.where(Category.parent_id == None)

    existing = session.exec(query).first()
    if existing:
        raise HTTPException(
            status_code=409, detail="Category name already exists in this scope"
        )

    db_category = Category(name=category.name, parent_id=category.parent_id)
    session.add(db_category)
    session.commit()
    session.refresh(db_category)
    return db_category


@router.get("/", response_model=List[CategoryRead])
def read_categories(session: Session = Depends(get_session)):
    categories = session.exec(select(Category)).all()
    return categories


@router.get("/tree", response_model=List[CategoryTree])
def read_categories_tree(session: Session = Depends(get_session)):
    roots = session.exec(select(Category).where(Category.parent_id == None)).all()

    def build_tree(category: Category) -> CategoryTree:
        children = session.exec(
            select(Category).where(Category.parent_id == category.id)
        ).all()
        return CategoryTree(
            id=category.id,
            name=category.name,
            parent_id=category.parent_id,
            created_at=category.created_at,
            children=[build_tree(c) for c in children],
        )

    return [build_tree(r) for r in roots]


@router.get("/{category_id}", response_model=CategoryTree)
def read_category(category_id: int, session: Session = Depends(get_session)):
    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    children = session.exec(
        select(Category).where(Category.parent_id == category_id)
    ).all()

    return CategoryTree(
        id=category.id,
        name=category.name,
        parent_id=category.parent_id,
        created_at=category.created_at,
        children=[
            CategoryTree(
                id=c.id,
                name=c.name,
                parent_id=c.parent_id,
                created_at=c.created_at,
                children=[],
            )
            for c in children
        ],
    )


@router.put("/{category_id}", response_model=CategoryRead)
def update_category(
    category_id: int,
    category_update: CategoryUpdate,
    session: Session = Depends(get_session),
):
    db_category = session.get(Category, category_id)
    if not db_category:
        raise HTTPException(status_code=404, detail="Category not found")

    if category_update.name:
        query = select(Category).where(
            Category.name == category_update.name, Category.id != category_id
        )
        if db_category.parent_id:
            query = query.where(Category.parent_id == db_category.parent_id)
        else:
            query = query.where(Category.parent_id == None)

        existing = session.exec(query).first()
        if existing:
            raise HTTPException(
                status_code=409, detail="Category name already exists in this scope"
            )

        db_category.name = category_update.name

    session.commit()
    session.refresh(db_category)
    return db_category


@router.delete("/{category_id}", status_code=204)
def delete_category(category_id: int, session: Session = Depends(get_session)):
    from models import Video

    category = session.get(Category, category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    def delete_children(parent_id: int):
        children = session.exec(
            select(Category).where(Category.parent_id == parent_id)
        ).all()
        for child in children:
            delete_children(child.id)
            session.delete(child)

    delete_children(category_id)

    videos = session.exec(select(Video).where(Video.category_id == category_id)).all()
    for video in videos:
        session.delete(video)

    session.delete(category)
    session.commit()
    return None
