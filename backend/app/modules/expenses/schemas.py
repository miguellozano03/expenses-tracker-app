from typing import Optional
from uuid import UUID
from datetime import date as date_type, datetime
from decimal import Decimal

from pydantic import BaseModel, ConfigDict, Field


class CategoryResponse(BaseModel):
    id: UUID
    name: str
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class CategoryCreate(BaseModel):
    name: str = Field(..., max_length=100)


class CategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)


class ExpenseResponse(BaseModel):
    id: UUID
    amount: Decimal
    date: date_type | None
    description: str | None
    category: Optional[CategoryResponse] = None
    created_at: datetime | None = None
    updated_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)


class ExpenseCreate(BaseModel):
    amount: Decimal
    date: Optional[date_type] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None


class ExpenseUpdate(BaseModel):
    amount: Optional[Decimal] = None
    date: Optional[date_type] = None
    description: Optional[str] = None
    category_id: Optional[UUID] = None
