from fastapi import Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from .repository import UserRepository, RefreshTokenRepository, PasswordResetTokenRepository
from .service import AuthService

def get_auth_service(session: Session = Depends(get_db)) -> AuthService:
    return AuthService(
        UserRepository(session),
        RefreshTokenRepository(session),
        PasswordResetTokenRepository(session)
    )