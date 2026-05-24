from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.modules.auth.models import User
from app.modules.auth.dependencies import get_current_user
from .service import CategoryService, ExpenseService
from .repository import CategoryRepository, ExpenseRepository


def get_category_service(
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> CategoryService:
    
    return CategoryService(
        CategoryRepository(session, current_user.id)
    )
    
def get_expense_service(
    session: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ExpenseService(
        ExpenseRepository(session, current_user.id),
        CategoryRepository(session, current_user.id)
    )