from pydantic import BaseModel
from typing import List, Optional

class CreatePostModel(BaseModel):
    title: str
    content: List[str]
    description: Optional[str] = None
    tags: List[str] = []

class PostUpdateModel(BaseModel):
    title: Optional[str] = None
    content: Optional[List[str]] = None
    description: Optional[str] = None
    tags: Optional[List[str]] = None

class PostResponseModel(BaseModel):
    id: str
    user_id: str
    title: str
    content: List[str]
    description: Optional[str] = None
    tags: List[str] = []
    created_at: str
    updated_at: str