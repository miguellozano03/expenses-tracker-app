from fastapi import APIRouter, Depends, Response, status

from .service import AuthService
from .dependencies import get_auth_service
from .schemas import (
    UserCreate,
    UserResponse,
    LoginSchema,
    RefreshRequest,
    TokenResponse
)

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, service: AuthService = Depends(get_auth_service)):
    return service.register(user)

@router.post("/login", response_model=TokenResponse, status_code=status.HTTP_200_OK)
def login(data: LoginSchema, service: AuthService = Depends(get_auth_service)):
    return service.login(data)

@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(data: RefreshRequest, service: AuthService = Depends(get_auth_service)):
    service.logout(data.refresh_token)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

@router.post("/refresh", response_model=TokenResponse)
def refresh(data: RefreshRequest, service: AuthService = Depends(get_auth_service)):
    return service.refresh(data.refresh_token)