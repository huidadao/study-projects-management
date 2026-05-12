from .categories import router as categories_router
from .videos import router as videos_router
from .dashboard import router as dashboard_router

__all__ = ["categories_router", "videos_router", "dashboard_router"]
