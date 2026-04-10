from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import List

from models.video import Video
from repositories.video import VideoRepository
from schemas.video import VideoCreate, VideoUpdate, VideoResponse

router = APIRouter()


def get_session():
    from main import engine
    with Session(engine) as session:
        yield session


@router.get("", response_model=List[VideoResponse])
async def get_videos(session: Session = Depends(get_session)):
    """Get all videos"""
    repo = VideoRepository(session)
    return repo.get_all()


@router.post("", response_model=VideoResponse, status_code=201)
async def create_video(video: VideoCreate, session: Session = Depends(get_session)):
    """Create a new video"""
    repo = VideoRepository(session)
    db_video = Video(**video.model_dump())
    created = repo.create(db_video)
    return created


@router.get("/{video_id}", response_model=VideoResponse)
async def get_video(video_id: int, session: Session = Depends(get_session)):
    """Get a single video by ID"""
    repo = VideoRepository(session)
    video = repo.get_by_id(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video


@router.put("/{video_id}", response_model=VideoResponse)
async def update_video(video_id: int, video_update: VideoUpdate, session: Session = Depends(get_session)):
    """Update a video"""
    repo = VideoRepository(session)
    video = repo.get_by_id(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    update_data = video_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(video, key, value)
    
    updated = repo.update(video)
    return updated


@router.delete("/{video_id}", response_model=VideoResponse)
async def delete_video(video_id: int, session: Session = Depends(get_session)):
    """Delete a video"""
    repo = VideoRepository(session)
    video = repo.get_by_id(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    repo.delete(video_id)
    return video