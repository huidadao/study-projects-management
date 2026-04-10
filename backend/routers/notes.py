from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session
from typing import List, Optional

from models.note import Note
from repositories.note import NoteRepository
from schemas.note import NoteCreate, NoteUpdate, NoteResponse

router = APIRouter()


def get_session():
    from main import engine
    with Session(engine) as session:
        yield session


@router.get("", response_model=List[NoteResponse])
async def get_notes(
    video_id: Optional[int] = Query(None, description="Filter notes by video ID"),
    session: Session = Depends(get_session)
):
    """Get all notes, optionally filtered by video_id"""
    repo = NoteRepository(session)
    
    if video_id:
        return repo.get_by_video_id(video_id)
    
    return repo.get_all()


@router.post("", response_model=NoteResponse, status_code=201)
async def create_note(note: NoteCreate, session: Session = Depends(get_session)):
    """Create a new timestamp note"""
    # Validate timestamp is non-negative
    if note.timestamp < 0:
        raise HTTPException(status_code=400, detail="Timestamp must be non-negative")
    
    # Validate content length
    if len(note.content) > 1000:
        raise HTTPException(status_code=400, detail="Content must be 1000 characters or less")
    
    repo = NoteRepository(session)
    db_note = Note(**note.model_dump())
    created = repo.create(db_note)
    return created


@router.get("/{note_id}", response_model=NoteResponse)
async def get_note(note_id: int, session: Session = Depends(get_session)):
    """Get a single note by ID"""
    repo = NoteRepository(session)
    note = repo.get_by_id(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note


@router.put("/{note_id}", response_model=NoteResponse)
async def update_note(
    note_id: int, 
    note_update: NoteUpdate, 
    session: Session = Depends(get_session)
):
    """Update a note's timestamp and/or content"""
    repo = NoteRepository(session)
    note = repo.get_by_id(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note_update.model_dump(exclude_unset=True)
    
    # Validate timestamp if provided
    if 'timestamp' in update_data and update_data['timestamp'] < 0:
        raise HTTPException(status_code=400, detail="Timestamp must be non-negative")
    
    # Validate content length if provided
    if 'content' in update_data and len(update_data['content']) > 1000:
        raise HTTPException(status_code=400, detail="Content must be 1000 characters or less")
    
    for key, value in update_data.items():
        setattr(note, key, value)
    
    updated = repo.update(note)
    return updated


@router.delete("/{note_id}", response_model=NoteResponse)
async def delete_note(note_id: int, session: Session = Depends(get_session)):
    """Delete a note"""
    repo = NoteRepository(session)
    note = repo.get_by_id(note_id)
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    repo.delete(note_id)
    return note