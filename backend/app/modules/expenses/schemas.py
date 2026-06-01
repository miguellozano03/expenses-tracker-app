from typing import Optional, List
from enum import Enum
from uuid import UUID
from datetime import date as date_type, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


# =========================================================
# CATEGORY SCHEMAS
# =========================================================

class CategoryCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)


class CategoryRead(BaseModel):
    id: UUID
    name: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================================================
# EXPENSE SCHEMAS
# =========================================================

class ExpenseCreate(BaseModel):
    amount: Decimal = Field(..., gt=0, max_digits=10, decimal_places=2)
    date: date_type = Field(default_factory=date_type.today)
    description: Optional[str] = Field(None, max_length=500)
    category_id: Optional[UUID] = None


class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = Field(None, gt=0, max_digits=10, decimal_places=2)
    date: Optional[date_type] = None
    description: Optional[str] = Field(None, max_length=500)
    category_id: Optional[UUID] = None


class ExpenseRead(BaseModel):
    id: UUID
    amount: Decimal
    date: date_type
    description: Optional[str] = None
    category: Optional[CategoryRead] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


# =========================================================
# DASHBOARD SCHEMAS
# =========================================================

class CategorySummary(BaseModel):
    name: str
    total: Decimal
    pct_of_total: float


class DashboardSummary(BaseModel):
    total_all_time: Decimal
    total_current_period: Decimal
    total_previous_period: Decimal
    variation_pct: float

    by_category: List[CategorySummary]
    top_3_categories: List[CategorySummary]

class TotalExpenses(BaseModel):
    total: Decimal
    
class PeriodFilter(str, Enum):
    day = "day"
    week = "week"
    month = "month"
    quarter = "quarter"
    year = "year"