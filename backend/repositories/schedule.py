from models.schedule import Schedule, ScheduleCompletion
from repositories.base import BaseRepository
from sqlmodel import Session, select
from typing import List, Optional


class ScheduleRepository(BaseRepository[Schedule]):
    def __init__(self, session: Session):
        super().__init__(Schedule, session)

    def get_by_video(self, video_id: int) -> List[Schedule]:
        return list(
            self.session.exec(
                select(Schedule).where(Schedule.video_id == video_id)
            ).all()
        )

    def get_upcoming(self) -> List[Schedule]:
        from datetime import date

        today = date.today().isoformat()
        return list(
            self.session.exec(
                select(Schedule)
                .where(Schedule.scheduled_date >= today, Schedule.completed == False)
                .order_by(Schedule.scheduled_date)
            ).all()
        )

    def complete(self, schedule_id: int) -> ScheduleCompletion:
        schedule = self.session.get(Schedule, schedule_id)
        if not schedule:
            raise ValueError(f"Schedule {schedule_id} not found")

        completion = ScheduleCompletion(schedule_id=schedule_id)
        self.session.add(completion)

        if schedule.recurring and schedule.recurring_type == "daily":
            from datetime import date, timedelta

            schedule.scheduled_date = (date.today() + timedelta(days=1)).isoformat()
        else:
            schedule.completed = True

        self.session.commit()
        self.session.refresh(schedule)
        return completion

    def reschedule(self, schedule_id: int, new_date: str) -> Schedule:
        schedule = self.session.get(Schedule, schedule_id)
        if not schedule:
            raise ValueError(f"Schedule {schedule_id} not found")
        schedule.scheduled_date = new_date
        self.session.commit()
        self.session.refresh(schedule)
        return schedule

    def get_completions(self, schedule_id: int) -> List[ScheduleCompletion]:
        return list(
            self.session.exec(
                select(ScheduleCompletion)
                .where(ScheduleCompletion.schedule_id == schedule_id)
                .order_by(ScheduleCompletion.completed_at.desc())
            ).all()
        )
