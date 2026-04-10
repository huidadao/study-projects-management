from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select, or_
from typing import List, Optional
from pydantic import BaseModel

from models.video import Video
from models.note import Note
from repositories.video import VideoRepository
from repositories.note import NoteRepository
from schemas.video import VideoCreate, VideoUpdate, VideoResponse

router = APIRouter()


def get_session():
    from main import engine
    with Session(engine) as session:
        yield session


@router.get("", response_model=List[VideoResponse])
async def get_videos(
    category_id: Optional[int] = Query(None, description="Filter videos by category"),
    session: Session = Depends(get_session)
):
    """Get all videos, optionally filtered by category"""
    repo = VideoRepository(session)
    videos = repo.get_all()
    
    if category_id:
        # Filter videos by category - this needs a video_categories join table
        # For now, return all (category filtering will be implemented in SCH-03)
        pass
    
    return videos


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


# Watched toggle endpoint
class WatchedToggle(BaseModel):
    """Pydantic model for watched toggle request"""
    watched: bool


@router.patch("/{video_id}/watched", response_model=VideoResponse)
async def toggle_watched(
    video_id: int, 
    toggle: WatchedToggle, 
    session: Session = Depends(get_session)
):
    """Toggle watched status for a video"""
    repo = VideoRepository(session)
    video = repo.get_by_id(video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    video.watched = toggle.watched
    updated = repo.update(video)
    return updated


# Search endpoint
@router.get("/search", response_model=List[VideoResponse])
async def search_videos(
    q: str = Query(..., description="Search query"),
    search_type: str = Query("title", description="Search type: title, channel, or notes"),
    limit: int = Query(100, description="Maximum results to return"),
    session: Session = Depends(get_session)
):
    """Search videos by title, channel, or notes content"""
    # Sanitize search query
    q = q.strip()
    if not q:
        return []
    
    # Limit results
    limit = min(limit, 100)
    
    # Build search query
    if search_type == "notes":
        # Join with notes table to search note content
        query = select(Video).join(Note, Note.video_id == Video.id).where(
            Note.content.like(f"%{q}%")
        ).limit(limit)
        videos = list(session.exec(query).all())
    else:
        # Search by title or channel
        field = Video.title if search_type == "title" else Video.channel
        query = select(Video).where(field.like(f"%{q}%")).limit(limit)
        videos = list(session.exec(query).all())
    
    return videos