from fastapi import APIRouter, Depends
from sqlmodel import Session, select, func
from database import get_session
from models import Category, Video
from schemas import DashboardData, CategoryProgress

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/", response_model=DashboardData)
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
