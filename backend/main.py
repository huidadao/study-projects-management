from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel, create_engine
import os

# Database setup
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(DATA_DIR, exist_ok=True)

DATABASE_URL = f"sqlite:///{os.path.join(DATA_DIR, 'study.db')}"
engine = create_engine(DATABASE_URL, echo=False)

app = FastAPI(
    title="YouTube Study Manager API",
    description="API for managing YouTube videos and study categories",
    version="1.0.0",
)


# Create tables on startup
@app.on_event("startup")
def create_tables():
    from models.video import Video
    from models.category import Category
    from models.note import Note
    from models.schedule import Schedule, ScheduleCompletion

    SQLModel.metadata.create_all(engine)


# CORS middleware - allow frontend origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Error handling middleware
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(status_code=500, content={"error": str(exc)})


# Health check endpoint
@app.get("/")
async def root():
    return {"status": "ok", "message": "YouTube Study Manager API"}


# Import and include routers
from routers.videos import router as videos_router
from routers.categories import router as categories_router
from routers.notes import router as notes_router
from routers.schedules import router as schedules_router

app.include_router(videos_router, prefix="/api/videos", tags=["videos"])
app.include_router(categories_router, prefix="/api/categories", tags=["categories"])
app.include_router(notes_router, prefix="/api/notes", tags=["notes"])
app.include_router(schedules_router, prefix="/api/schedules", tags=["schedules"])
