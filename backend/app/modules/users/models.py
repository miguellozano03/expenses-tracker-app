from uuid import UUID, uuid4
from datetime import datetime, timezone

from sqlalchemy.dialects.postgresql import UUID as PGUUID
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base
from app.core.mixin import TimestampMixin, SoftDeleteMixin

class User(TimestampMixin, SoftDeleteMixin, Base):
    __tablename__ = "users"
    
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=True)
    
    email: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    nickname: Mapped[str] = mapped_column(String(100), nullable=False)
    password: Mapped[str] = mapped_column(String(128), nullable=False)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    last_login: Mapped[datetime | None] = mapped_column(nullable=True)
    
    
    reset_tokens: Mapped[list["PasswordResetToken"]] = relationship(back_populates="user")
    refresh_tokens: Mapped[list["RefreshToken"]] = relationship(back_populates="user")
    
    
class PasswordResetToken(TimestampMixin, Base):
    __tablename__ = "password_reset_tokens"
    
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=True)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    code: Mapped[str] = mapped_column(String(128), nullable=False)
    expires_at: Mapped[datetime] = mapped_column(nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="reset_tokens")
    
class RefreshToken(TimestampMixin, Base):
    __tablename__ = "refresh_tokens"
    
    id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), primary_key=True, default=uuid4, unique=True, nullable=True)
    user_id: Mapped[UUID] = mapped_column(PGUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    token: Mapped[str] = mapped_column(String(512), unique=True, nullable=True, index=True)
    expires_at: Mapped[datetime] = mapped_column(nullable=False)
    revoked_at: Mapped[datetime | None] = mapped_column(nullable=True)
    
    user: Mapped["User"] = relationship(back_populates="refresh_tokens")
    
    @property
    def is_valid(self) -> bool:
        return self.revoked_at is None and self.expires_at > datetime.now(timezone.utc)