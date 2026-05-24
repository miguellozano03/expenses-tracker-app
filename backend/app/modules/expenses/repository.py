from uuid import UUID
from typing import Sequence

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.repository import BaseRepository
from .models import Expense, Category


class ExpenseRepository(BaseRepository[Expense]):

    def __init__(self, session: Session, user_id: UUID) -> None:
        super().__init__(Expense, session)
        self.user_id = user_id

    def get_by_id(self, record_id: UUID, include_deleted: bool = False) -> Expense | None:
        stmt = (
            select(Expense)
            .where(Expense.id == record_id)
            .where(Expense.user_id == self.user_id)
        )
        if not include_deleted:
            stmt = stmt.where(Expense.is_deleted == False)
        return self.session.scalar(stmt)
    
    def get_all(self, limit: int, offset: int, include_deleted: bool = False) -> Sequence[Expense]:
        stmt = (
            select(Expense)
            .where(Expense.user_id == self.user_id)
            .limit(limit)
            .offset(offset)
        )
        if not include_deleted:
            stmt = stmt.where(Expense.is_deleted == False)
        return self.session.scalars(stmt).all()

    def create(self, data: dict) -> Expense:
        return super().create({**data, "user_id": self.user_id})
      
class CategoryRepository(BaseRepository[Category]):

    def __init__(self, session: Session, user_id: UUID) -> None:
        super().__init__(Category, session)
        self.user_id = user_id

    def get_by_id(self, record_id: UUID, include_deleted: bool = False) -> Category | None:
        stmt = (
            select(Category)
            .where(Category.id == record_id)
            .where(Category.user_id == self.user_id)
        )
        if not include_deleted:
            stmt = stmt.where(Category.is_deleted == False)
        return self.session.scalar(stmt)
    
    def get_by_name(self, name: str) -> Category | None:
        return self.get_by_field("name", name)

    def get_all(self, limit: int, offset: int, include_deleted: bool = False) -> Sequence[Category]:
        stmt = (
            select(Category)
            .where(Category.user_id == self.user_id)
            .limit(limit)
            .offset(offset)
        )
        if not include_deleted:
            stmt = stmt.where(Category.is_deleted == False)
        return self.session.scalars(stmt).all()

    def create(self, data: dict) -> Category:
        return super().create({**data, "user_id": self.user_id})