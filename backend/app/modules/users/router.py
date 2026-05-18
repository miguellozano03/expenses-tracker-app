from fastapi import APIRouter, Depends, status

from .service import AuthService
from .dependencies import get_auth_service
from .schemas import UserCreate, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, service: AuthService = Depends(get_auth_service)):
    return service.register(user)