from fastapi import APIRouter, Depends, HTTPException, status
from models.public_profile_models import PublicProfileResponse, UpdateProfileModel
from router.auth_dependencies import get_current_user
from db.supabase_client import supabase

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("/me", response_model=PublicProfileResponse)
def get_my_profile(current_user = Depends(get_current_user)):
    try:
        response = supabase.table("profiles")\
            .select("*")\
            .eq("id", str(current_user.id))\
            .limit(1)\
            .execute()
        
        if not response.data:
            raise HTTPException(404, "Perfil no encontrado")
        
        return response.data[0]
    
    except Exception:
        raise HTTPException(404, "Perfil no encontrado")


@router.get("/{username}", response_model=PublicProfileResponse)
def get_public_profile(username: str):
    try:
        response = supabase.table("profiles")\
            .select("username, full_name, bio, phone, profile_picture_url, social_links, created_at")\
            .eq("username", username)\
            .limit(1)\
            .execute()
        
        if not response.data:
            raise HTTPException(404, "Usuario no encontrado")
        
        return response.data[0]
    
    except Exception:
        raise HTTPException(404, "Usuario no encontrado")

@router.patch("/update")
def update_profile(data:UpdateProfileModel, current_user = Depends(get_current_user)):
    update_data = {k: v for k, v in data.dict().items() if v is not None}
    
    if not update_data:
        raise HTTPException(400, "No hay datos para actualizar")

    response = supabase.table("profiles")\
        .update(update_data)\
        .eq("id", current_user.id)\
        .execute()

    return {"message": "Perfil actualizado", "profile": response.data[0]}