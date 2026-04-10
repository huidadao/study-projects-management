from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
from typing import List, Optional
from pydantic import BaseModel

from models.schedule import Schedule, ScheduleCompletion
from repositories.schedule import ScheduleRepository


router = APIRouter()


def get_session():
    from main import engine

    with Session(engine) as session:
        yield session


class ScheduleCreate(BaseModel):
    video_id: int
    scheduled_date: str
    recurring: bool = False
    recurring_type: Optional[str] = None


class ScheduleResponse(BaseModel):
    id: int
    video_id: int
    scheduled_date: str
    recurring: bool
    recurring_type: Optional[str]
    completed: bool

    class Config:
        from_attributes = True


@router.get("", response_model=List[ScheduleResponse])
async def get_schedules(session: Session = Depends(get_session)):
    """Get all schedules"""
    repo = ScheduleRepository(session)
    return repo.get_all()


@router.get("/upcoming", response_model=List[ScheduleResponse])
async def get_upcoming(session: Session = Depends(get_session)):
    """Get upcoming schedules"""
    repo = ScheduleRepository(session)
    return repo.get_upcoming()


@router.post("", response_model=ScheduleResponse, status_code=201)
async def create_schedule(
    schedule: ScheduleCreate, session: Session = Depends(get_session)
):
    """Create a new schedule"""
    repo = ScheduleRepository(session)
    db_schedule = Schedule(**schedule.model_dump(exclude_none=True))
    return repo.create(db_schedule)


@router.post("/{schedule_id}/complete", response_model=ScheduleResponse)
async def complete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    """Mark schedule as complete"""
    repo = ScheduleRepository(session)
    try:
        repo.complete(schedule_id)
        return session.get(Schedule, schedule_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Schedule not found")


@router.put("/{schedule_id}", response_model=ScheduleResponse)
async def reschedule_video(
    schedule_id: int, scheduled_date: str, session: Session = Depends(get_session)
):
    """Reschedule a video"""
    repo = ScheduleRepository(session)
    try:
        return repo.reschedule(schedule_id, scheduled_date)
    except ValueError:
        raise HTTPException(status_code=404, detail="Schedule not found")


@router.delete("/{schedule_id}", status_code=204)
async def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    """Remove from schedule"""
    repo = ScheduleRepository(session)
    if not repo.delete(schedule_id):
        raise HTTPException(status_code=404, detail="Schedule not found")
