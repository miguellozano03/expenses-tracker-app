from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status

from app.security.jwt import create_access_token, create_refresh_token
from app.security.passwords import hash_password, verify_password
from .repository import (
    AbstractPasswordResetTokenRepository,
    AbstractRefreshTokenRepository,
    AbstractUserRepository,
)
from .models import User
from .schemas import LoginSchema, TokenResponse, UserCreate, UserResponse

class AuthService:
    def __init__(
        self,
        user_repo: AbstractUserRepository,
        refresh_token_repo: AbstractRefreshTokenRepository,
        password_reset_repo: AbstractPasswordResetTokenRepository,
    ) -> None:
        self.user_repo = user_repo
        self.refresh_token_repo = refresh_token_repo
        self.password_reset_repo = password_reset_repo

    def register(self, data: UserCreate):
        existing_user = self.user_repo.get_by_email(data.email)
        if existing_user:
            raise HTTPException(
                status.HTTP_409_CONFLICT,
                "Email already registered",
            )
        return self.user_repo.create({
            "email": data.email,
            "nickname": data.nickname,
            "password": hash_password(data.password),
        })

    def login(self, data: LoginSchema) -> TokenResponse:
        user = self.user_repo.get_by_email(data.email)
        if not user:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED,
                "Wrong credentials",
            )
        if not verify_password(data.password, user.password):
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED,
                "Wrong credentials",
            )
        if not user.is_active:
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                "Account disabled",
            )
        self.user_repo.update(
            user,
            {"last_login": datetime.now(timezone.utc)},
        )
        access_token = create_access_token(user.id)
        refresh_token = create_refresh_token(user.id)
        expires_at = datetime.now(timezone.utc) + timedelta(days=30)
        self.refresh_token_repo.create({
            "user_id": user.id,
            "token": refresh_token,
            "expires_at": expires_at,
        })
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    def logout(self, refresh_token: str) -> None:
        token = self.refresh_token_repo.get_valid_token(refresh_token)
        if not token:
            return
        self.refresh_token_repo.revoke(token)
        
    def profile(self, user: User) -> UserResponse:
        return UserResponse.model_validate(user)

    def refresh(self, refresh_token: str) -> TokenResponse:
        token = self.refresh_token_repo.get_valid_token(refresh_token)
        if not token:
            raise HTTPException(
                status.HTTP_401_UNAUTHORIZED,
                "Invalid refresh token",
            )
        access_token = create_access_token(token.user_id)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
        )

    def forgot_password(self):
        pass

    def reset_password(self):
        pass