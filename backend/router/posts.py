from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List
from models.posts_models import CreatePostModel, PostUpdateModel, PostResponseModel
from router.auth_dependencies import get_current_user
from db.supabase_client import supabase

router = APIRouter(prefix="/posts", tags=["posts"])

@router.post("/", response_model=PostResponseModel, status_code=status.HTTP_201_CREATED)
def create_post(data: CreatePostModel, current_user = Depends(get_current_user)):
    if not data.title.strip():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="El título no puede estar vacío, es obligatorio.")
    if not data.content:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="para crear un post necesita minimo una imagen.")
    
    response = supabase.table("posts").insert({
        "user_id": str(current_user.id),
        "title": data.title,
        "content": data.content,
        "description": data.description,
        "tags": data.tags
    }).execute()
    
    return response.data[0]

@router.get("/feed", response_model=List[PostResponseModel])
def get_feed(limit: int = 20, offset: int = 0):
    response = supabase.table("posts")\
        .select("*")\
        .order("created_at", desc=True)\
        .range(offset, offset + limit - 1)\
        .execute()
        
    return response.data

@router.get("/@{username}", response_model=List[PostResponseModel])
def get_user_posts(username: str, limit: int = 20, offset: int = 0):
    
    profile = supabase.table("profiles")\
        .select("id")\
        .eq("username", username)\
        .limit(1)\
        .execute()
    
    if not profile.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado")
    
    user_id = profile.data[0]['id']
    response = supabase.table("posts")\
        .select("*")\
        .eq("user_id", user_id)\
        .order("created_at", desc=True)\
        .range(offset, offset + limit - 1)\
        .execute()
        
    return response.data

@router.get("/tag/{tag}", response_model=List[PostResponseModel])
def get_posts_by_tag(tag: str, limit: int = 20, offset: int = 0):
    response = supabase.table("posts")\
        .select("*")\
        .contains("tags", [tag])\
        .order("created_at", desc=True)\
        .range(offset, offset + limit - 1)\
        .execute()
    
    return response.data

@router.patch("/{post_id}", response_model=PostResponseModel)
def update_post(post_id: str, data: PostUpdateModel, current_user = Depends(get_current_user)):
    if not any([data.title, data.content, data.description, data.tags]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No hay datos para actualizar")
    
    posts = supabase.table("posts")\
        .select("user_id")\
        .eq("id", post_id)\
        .limit(1)\
        .execute()
    
    if not posts.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post no encontrado")
    if posts.data[0]['user_id'] != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado para actualizar este post")
    
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    update_data["updated_at"] = "now()"
    
    response = supabase.table("posts")\
        .update(update_data)\
        .eq("id", post_id)\
        .execute()
    
    return response.data[0]

@router.delete("/delete/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: str, current_user = Depends(get_current_user)):
    posts = supabase.table("posts")\
        .select("user_id")\
        .eq("id", post_id)\
        .limit(1)\
        .execute()
    
    if not posts.data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post no encontrado")
    if posts.data[0]['user_id'] != str(current_user.id):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="No autorizado para eliminar este post")
    
    supabase.table("posts")\
        .delete()\
        .eq("id", post_id)\
        .execute()
    
    return None