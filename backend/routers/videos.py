from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List, Optional
from database import get_session
from models import Category, Video
from schemas import VideoCreate, VideoUpdate, VideoRead

router = APIRouter(prefix="/videos", tags=["videos"])


@router.post("/", response_model=VideoRead, status_code=201)
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


@router.get("/", response_model=List[VideoRead])
def read_videos(
    category_id: Optional[int] = None, session: Session = Depends(get_session)
):
    query = select(Video)
    if category_id:
        query = query.where(Video.category_id == category_id)
    videos = session.exec(query).all()
    return videos


@router.get("/{video_id}", response_model=VideoRead)
def read_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


@router.put("/{video_id}", response_model=VideoRead)
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


@router.delete("/{video_id}", status_code=204)
def delete_video(video_id: int, session: Session = Depends(get_session)):
    video = session.get(Video, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")

    session.delete(video)
    session.commit()
    return None
