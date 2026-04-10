from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class Schedule(SQLModel, table=True):
    __tablename__ = "schedules"

    id: Optional[int] = Field(default=None, primary_key=True)
    video_id: int = Field(foreign_key="videos.id")
    scheduled_date: str
    recurring: bool = Field(default=False)
    recurring_type: Optional[str] = None
    completed: bool = Field(default=False)
    created: str = Field(default_factory=lambda: datetime.now().isoformat())


class ScheduleCompletion(SQLModel, table=True):
    __tablename__ = "schedule_completions"

    id: Optional[int] = Field(default=None, primary_key=True)
    schedule_id: int = Field(foreign_key="schedules.id")
    completed_at: str = Field(default_factory=lambda: datetime.now().isoformat())
