from fastapi import APIRouter
from app.modules.auth.router import router as auth_router
from app.modules.expenses.router import category_router, expenses_router

router = APIRouter(prefix="/api/v1")

router.include_router(auth_router)
router.include_router(expenses_router)
router.include_router(category_router)