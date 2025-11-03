from pydantic import BaseModel, EmailStr
from typing import Optional, Dict

class RegisterModel(BaseModel):
    email: EmailStr
    password: str
    username: str
    full_name: str = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    social_links: Optional[Dict] = None

class LoginModel(BaseModel):
    email: EmailStr
    password: str

class AuthSuccessResponse(BaseModel):
    message: str
    access_token: str
    refresh_token: Optional[str] = None
    expires_in: int
    user_id: str

class RegisterVerificationResponse(BaseModel):
    message: str
    user_id: str