from pydantic import BaseModel
from typing import Optional, Dict

class PublicProfileResponse(BaseModel):
    username: str
    full_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    profile_picture_url: Optional[str] = None
    social_links: Optional[Dict] = None
    created_at: str

class UpdateProfileModel(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    phone: Optional[str] = None
    profile_picture_url: Optional[str] = None
    social_links: Optional[Dict] = None