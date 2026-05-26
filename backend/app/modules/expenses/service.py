from typing import Sequence
from datetime import date, timedelta
from decimal import Decimal
from uuid import UUID

from fastapi import HTTPException, status

from .models import Category, Expense
from .repository import CategoryRepository, ExpenseRepository
from .schemas import (
    CategoryCreate,
    CategoryUpdate,
    ExpenseCreate,
    ExpenseUpdate,
    PeriodFilter,
)

class CategoryService:
    def __init__(self, category_repository: CategoryRepository) -> None:
        self.repo = category_repository
        
    def create(self, data: CategoryCreate):
        existing_category = self.repo.get_by_name(data.name)
        
        if existing_category:
            raise HTTPException(status.HTTP_409_CONFLICT, "Category already exists")
        
        return self.repo.create(data.model_dump())
    
    def get_all(self, limit: int, offset: int):
        return self.repo.get_all(limit, offset)
    
    def get_by_id(self, category_id: UUID) -> Category:
        category = self.repo.get_by_id(category_id)
        
        if not category:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
        
        return category
    
    def update(self, category: Category, data: CategoryUpdate):
        return self.repo.update(category, data.model_dump(exclude_unset=True))
    
    def delete(self, category: Category):
        return self.repo.soft_delete(category)
    
    def hard_delete(self, category: Category):
        return self.repo.hard_delete(category)


class ExpenseService:
    def __init__(
        self,
        expense_repository: ExpenseRepository,
        category_repository: CategoryRepository,
    ) -> None:
        self.repo = expense_repository
        self.category_repo = category_repository

    # =========================================================
    # CRUD
    # =========================================================

    def create(self, data: ExpenseCreate) -> Expense:
        if data.category_id:
            category = self.category_repo.get_by_id(data.category_id)
            if not category:
                raise HTTPException(status.HTTP_404_NOT_FOUND, "Category not found")
        return self.repo.create(data.model_dump())

    def get_all(self, limit: int, offset: int) -> Sequence[Expense]:
        return self.repo.get_all(limit, offset)

    def get_by_id(self, expense_id: UUID) -> Expense:
        expense = self.repo.get_by_id(expense_id)
        if not expense:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Expense not found")
        return expense

    def update(self, expense: Expense, data: ExpenseUpdate) -> Expense:
        return self.repo.update(expense, data.model_dump(exclude_unset=True))

    def delete(self, expense: Expense) -> Expense:
        return self.repo.soft_delete(expense)

    def hard_delete(self, expense: Expense) -> None:
        return self.repo.hard_delete(expense)

    # =========================================================
    # DASHBOARD
    # =========================================================

    def _resolve_period(self, period: PeriodFilter) -> tuple[date, date]:
        today = date.today()
        match period:
            case PeriodFilter.day:
                return today, today
            case PeriodFilter.week:
                return today - timedelta(weeks=1), today
            case PeriodFilter.month:
                return today.replace(day=1), today
            case PeriodFilter.quarter:
                return today - timedelta(days=90), today
            case PeriodFilter.year:
                return today.replace(month=1, day=1), today

    def _get_previous_period(self, period: PeriodFilter) -> tuple[date, date]:
        today = date.today()
        match period:
            case PeriodFilter.day:
                yesterday = today - timedelta(days=1)
                return yesterday, yesterday
            case PeriodFilter.week:
                return today - timedelta(weeks=2), today - timedelta(weeks=1)
            case PeriodFilter.month:
                first_day = today.replace(day=1)
                prev_end = first_day - timedelta(days=1)
                prev_start = prev_end.replace(day=1)
                return prev_start, prev_end
            case PeriodFilter.quarter:
                return today - timedelta(days=180), today - timedelta(days=90)
            case PeriodFilter.year:
                return today.replace(year=today.year - 1, month=1, day=1), today.replace(year=today.year - 1, month=12, day=31)

    def get_total_expenses(self) -> Decimal | None:
        return self.repo.get_total_expenses()

    def get_summary(self, period: PeriodFilter) -> dict:
        start, end = self._resolve_period(period)
        prev_start, prev_end = self._get_previous_period(period)

        total_current = self.repo.get_total_expenses_for_period(start, end) or Decimal(0)
        total_previous = self.repo.get_total_expenses_for_period(prev_start, prev_end) or Decimal(0)

        variation = (
            round(((total_current - total_previous) / total_previous) * 100, 2)
            if total_previous > 0 else 0.0
        )

        by_category = self.repo.get_expenses_grouped_by_category(start, end) or []

        total_all_time = self.repo.get_total_expenses() or Decimal(0)

        # % por categoría
        category_percent = [
            {
                "name": c,
                "total": t,
                "pct_of_total": round((t / total_current * 100), 2) if total_current > 0 else 0.0
            }
            for c, t in by_category
        ]

        # top 3
        top_3 = sorted(category_percent, key=lambda x: x["total"], reverse=True)[:3]

        return {
            "total_all_time": total_all_time,
            "total_current_period": total_current,
            "total_previous_period": total_previous,
            "variation_pct": variation,
            "by_category": category_percent,
            "top_3_categories": top_3,
        }