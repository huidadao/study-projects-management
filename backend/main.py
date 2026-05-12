from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select, func
from typing import List, Optional
from database import create_db_and_tables, get_session
from models import Category, Video
from schemas import (
    CategoryCreate,
    CategoryUpdate,
    CategoryRead,
    CategoryTree,
    VideoCreate,
    VideoUpdate,
    VideoRead,
    DashboardData,
    CategoryProgress,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()


@app.get("/")
def root() -> dict:
    return {"message": "Backend running"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


@app.post("/categories", response_model=CategoryRead, status_code=201)
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


@app.get("/categories", response_model=List[CategoryRead])
def read_categories(session: Session = Depends(get_session)):
    categories = session.exec(select(Category)).all()
    return categories


@app.get("/categories/tree", response_model=List[CategoryTree])
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


@app.get("/categories/{category_id}", response_model=CategoryTree)
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


@app.put("/categories/{category_id}", response_model=CategoryRead)
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


@app.delete("/categories/{category_id}", status_code=204)
def delete_category(category_id: int, session: Session = Depends(get_session)):
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


@app.post("/videos", response_model=VideoRead, status_code=201)
def create_video(video: VideoCreate, session: Session = Depends(get_session)):
    category = session.get(Category, video.category_id)
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    db_video = Video(
        title=video.title,
        url=video.url,
        category_id=video.category_id,
        watched=video.watched,
    )
    session.add(db_video)
    session.commit()
    session.refresh(db_video)
    return db_video


@app.get("/videos", response_model=List[VideoRead])
def read_videos(
    category_id: Optional[int] = None, session: Session = Depends(get_session)
):
    query = select(Video)
    if category_id:
        query = query.where(Video.category_id == category_id)
    videos = session.exec(query).all()
    return videos


@app.get("/videos/{video_id}", response_model=VideoRead)
def read_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


@app.put("/videos/{video_id}", response_model=VideoRead)
def update_video(
    video_id: int, video_update: VideoUpdate, session: Session = Depends(get_session)
):
    db_video = session.get(Video, video_id)
    if not db_video:
        raise HTTPException(status_code=404, detail="Video not found")

    if video_update.category_id and video_update.category_id != db_video.category_id:
        category = session.get(Category, video_update.category_id)
        if not category:
            raise HTTPException(status_code=404, detail="Category not found")
        db_video.category_id = video_update.category_id

    if video_update.title is not None:
        db_video.title = video_update.title
    if video_update.url is not None:
        db_video.url = video_update.url
    if video_update.watched is not None:
        db_video.watched = video_update.watched

    session.commit()
    session.refresh(db_video)
    return db_video


@app.delete("/videos/{video_id}", status_code=204)
def delete_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    session.delete(video)
    session.commit()
    return None


@app.get("/dashboard", response_model=DashboardData)
def get_dashboard(session: Session = Depends(get_session)):
    total_categories = session.exec(select(func.count(Category.id))).first() or 0
    total_videos = session.exec(select(func.count(Video.id))).first() or 0
    watched_videos = (
        session.exec(select(func.count(Video.id)).where(Video.watched == True)).first()
        or 0
    )

    categories = session.exec(select(Category)).all()
    progress_by_category = []

    for category in categories:
        total = (
            session.exec(
                select(func.count(Video.id)).where(Video.category_id == category.id)
            ).first()
            or 0
        )
        watched = (
            session.exec(
                select(func.count(Video.id)).where(
                    Video.category_id == category.id, Video.watched == True
                )
            ).first()
            or 0
        )

        progress_by_category.append(
            CategoryProgress(
                category_id=category.id,
                category_name=category.name,
                total_videos=total,
                watched_videos=watched,
            )
        )

    return DashboardData(
        total_categories=total_categories,
        total_videos=total_videos,
        watched_videos=watched_videos,
        progress_by_category=progress_by_category,
    )
