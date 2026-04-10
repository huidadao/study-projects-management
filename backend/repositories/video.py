from models.video import Video
from repositories.base import BaseRepository
from sqlmodel import Session


class VideoRepository(BaseRepository[Video]):
    def __init__(self, session: Session):
        super().__init__(Video, session)