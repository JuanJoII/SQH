from fastapi import APIRouter, Depends, HTTPException, status
from router.auth_dependencies import get_current_user
from db.supabase_client import supabase

router = APIRouter(prefix='/avatar', tags=['avatar'])

@router.get("/unlocked")
def get_unlocked_avatars(current_user = Depends(get_current_user)):
    user_id = str(current_user.id)
    
    response = supabase.table("unlocked_avatars")\
        .select("avatars(id, name, image_url, affinity, rarity)")\
        .eq("user_id", user_id)\
        .execute()
    
    avatars = [item["avatars"] for item in response.data] 
    
    if not avatars:
        raise HTTPException
    
    return {
        "total": len(avatars),
        "collection": avatars
    }