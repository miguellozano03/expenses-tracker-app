from typing import Literal
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, field_validator, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    nickname: str
    password: str = Field(min_length=8, max_length=64)
    
    @field_validator('password', mode='before')
    @classmethod
    def password_strength(cls, v: str) -> str:
        has_upper = has_lower = has_number = False
        
        for c in v:
            if c.isupper():
                has_upper = True
            elif c.islower():
                has_lower = True
            elif c.isdigit():
                has_number = True
            if has_upper and has_lower and has_number:
                break
        
        if not has_upper:
            raise ValueError("Password must have at least one capital letter")
        
        if not has_lower:
            raise ValueError("Password must have at least one lower case letter")
        
        if not has_number:
            raise ValueError("Password must have at least one number")
        
        return v

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    nickname: str
    is_active: bool
    last_login: datetime | None
    
    model_config = ConfigDict(from_attributes=True)
    
    
class LoginSchema(BaseModel):
    email: EmailStr
    password: str
    
class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    type: Literal["bearer"] = "bearer"
    
class RefreshRequest(BaseModel):
    refresh_token: str