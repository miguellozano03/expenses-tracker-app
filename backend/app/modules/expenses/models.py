from typing import TYPE_CHECKING
from uuid import UUID, uuid4
from decimal import Decimal
from datetime import date as date_type

from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy import String, Numeric, Text, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.mixin import SoftDeleteMixin, TimestampMixin
from app.core.database import Base

if TYPE_CHECKING:
    from app.modules.auth.models import User


class Category(TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "categories"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    user: Mapped["User"] = relationship(back_populates="categories")
    expenses: Mapped[list["Expense"]] = relationship(back_populates="category")
    

class Expense(TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "expenses"
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10,2), nullable=False)
    date: Mapped[date_type] = mapped_column(nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    category_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="expenses")
    category: Mapped["Category | None"] = relationship(back_populates="expenses")