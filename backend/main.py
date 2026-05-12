from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_db_and_tables
from routers import categories, videos, dashboard

app = FastAPI()

# Allow origins: local dev + Vercel production + Vercel preview deployments
origins = [
    "http://localhost:5173",
    "https://localhost:5173",
]

# If you have a specific Vercel domain, add it here after first deploy:
# origins.append("https://your-project.vercel.app")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()


@app.get("/")
def root() -> dict:
    return {"message": "Backend running"}


@app.get("/health")
def health() -> dict:
    return {"status": "ok"}


app.include_router(categories.router)
app.include_router(videos.router)
app.include_router(dashboard.router)
