from models.note import Note
from repositories.base import BaseRepository
from sqlmodel import Session, select


class NoteRepository(BaseRepository[Note]):
    def __init__(self, session: Session):
        super().__init__(Note, session)
    
    def get_by_video_id(self, video_id: int) -> list[Note]:
        """Get all notes for a specific video, ordered by timestamp"""
        return list(self.session.exec(
            select(Note).where(Note.video_id == video_id).order_by(Note.timestamp)
        ).all())