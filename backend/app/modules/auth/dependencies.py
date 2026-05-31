from uuid import UUID
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.security.jwt import decode_token
from .repository import UserRepository, RefreshTokenRepository, PasswordResetTokenRepository
from .service import AuthService
from .models import User

bearer_scheme = HTTPBearer()

def get_auth_service(session: Session = Depends(get_db)) -> AuthService:
    return AuthService(
        UserRepository(session),
        RefreshTokenRepository(session),
        PasswordResetTokenRepository(session)
    )
    
def get_current_user( credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme), session: Session = Depends(get_db)) -> User:
    payload = decode_token(credentials.credentials)

    if payload is None or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = UserRepository(session).get_by_id(UUID(payload["sub"]))

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user