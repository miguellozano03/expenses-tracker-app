from fastapi import HTTPException, status

from app.security.passwords import hash_password, verify_password
from .repository import AbstractUserRepository
from .schemas import UserCreate


class AuthService:
    
    def __init__(self, repo: AbstractUserRepository) -> None:
        self.repo = repo
    
    def register(self, data: UserCreate):
        if self.repo.get_by_email(data.email):
            raise HTTPException(status.HTTP_409_CONFLICT, "Email already registered")
        
        return self.repo.create({
            "email": data.email,
            "nickname": data.nickname,
            "password": hash_password(data.password)
        })
    
    def login(self):
        pass
    
    def logout(self):
        pass
    
    def refresh(self):
        pass
    
    def forgot_password(self):
        pass
    
    def reset_password(self):
        pass
    