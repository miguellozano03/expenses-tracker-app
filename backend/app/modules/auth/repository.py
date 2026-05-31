from abc import ABC, abstractmethod
from datetime import datetime, timezone
from typing import Protocol, Sequence
from uuid import UUID

from sqlalchemy import select

from app.core.repository import BaseRepository

from .models import (
    PasswordResetToken,
    RefreshToken,
    User,
)


# =========================================================
# ABSTRACT REPOSITORIES
# =========================================================

class AbstractUserRepository(ABC):
    @abstractmethod
    def get_by_id(self, record_id: UUID, include_deleted: bool = False) -> User | None:
        pass

    @abstractmethod
    def get_by_email(self, email: str) -> User | None:
        pass

    @abstractmethod
    def get_all(self, limit: int, offset: int, include_deleted: bool = False) -> Sequence[User]:
        pass

    @abstractmethod
    def create(self, data: dict) -> User:
        pass

    @abstractmethod
    def update(self, instance: User, data: dict) -> User:
        pass

    @abstractmethod
    def soft_delete(self, instance: User) -> User:
        pass

    @abstractmethod
    def hard_delete(self, instance: User) -> None:
        pass

class AbstractRefreshTokenRepository(ABC):
    @abstractmethod
    def create(self, data: dict) -> RefreshToken:
        pass

    @abstractmethod
    def get_valid_token(self, token: str) -> RefreshToken | None:
        pass

    @abstractmethod
    def revoke(self, token: RefreshToken) -> RefreshToken:
        pass

    @abstractmethod
    def revoke_all_user_tokens(self, user_id: UUID) -> None:
        pass


class AbstractPasswordResetTokenRepository(ABC):
    @abstractmethod
    def get_valid_code(self, code: str) -> PasswordResetToken | None:
        pass

    @abstractmethod
    def mark_as_used(self, token: PasswordResetToken) -> PasswordResetToken:
        pass


# =========================================================
# CONCRETE REPOSITORIES
# =========================================================

class UserRepository(BaseRepository[User], AbstractUserRepository):
    def __init__(self, session) -> None:
        super().__init__(User, session)

    def get_by_email(self, email: str) -> User | None:
        return self.get_by_field("email", email)


class RefreshTokenRepository(BaseRepository[RefreshToken], AbstractRefreshTokenRepository):
    def __init__(self, session):
        super().__init__(RefreshToken, session)

    def get_valid_token(self, token: str) -> RefreshToken | None:
        stmt = (
            select(RefreshToken)
            .where(RefreshToken.token == token)
            .where(RefreshToken.revoked_at.is_(None))
            .where(RefreshToken.expires_at > datetime.now(timezone.utc))
        )
        return self.session.scalar(stmt)

    def revoke(self, token: RefreshToken) -> RefreshToken:
        token.revoked_at = datetime.now(timezone.utc)
        self.session.flush()
        return token

    def revoke_all_user_tokens(self, user_id: UUID) -> None:
        stmt = (
            select(RefreshToken)
            .where(RefreshToken.user_id == user_id)
            .where(RefreshToken.revoked_at.is_(None))
        )
        tokens = self.session.scalars(stmt).all()
        now = datetime.now(timezone.utc)
        for token in tokens:
            token.revoked_at = now
        self.session.flush()


class PasswordResetTokenRepository(BaseRepository[PasswordResetToken], AbstractPasswordResetTokenRepository):
    def __init__(self, session):
        super().__init__(PasswordResetToken, session)

    def get_valid_code(self, code: str) -> PasswordResetToken | None:
        stmt = (
            select(PasswordResetToken)
            .where(PasswordResetToken.code == code)
            .where(PasswordResetToken.used_at.is_(None))
            .where(PasswordResetToken.expires_at > datetime.now(timezone.utc))
        )
        return self.session.scalar(stmt)

    def mark_as_used(self, token: PasswordResetToken) -> PasswordResetToken:
        token.used_at = datetime.now(timezone.utc)
        self.session.flush()
        return token