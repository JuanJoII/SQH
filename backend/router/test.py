from fastapi import APIRouter, HTTPException, Depends, status
from models.test_models import TestAnswerModel, TestResultResponse
from services.test_service import calculate_affinity
from router.auth_dependencies import get_current_user
from db.supabase_client import supabase

router = APIRouter(prefix="/test", tags=["test"])

@router.post("/affinity", response_model=TestResultResponse)
def take_test(
    answers: TestAnswerModel,
    current_user = Depends(get_current_user)
):
    user_id = str(current_user.id)

    if supabase.table("user_test_results").select("id").eq("user_id", user_id).limit(1).execute().data:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Ya completaste el test.")

    result = calculate_affinity(answers)
    affinity = result["main_affinity"].split(" + ")[0]

    avatar = supabase.table("avatars")\
        .select("id, name, image_url")\
        .eq("affinity", affinity)\
        .limit(1)\
        .execute()

    if not avatar.data:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Avatar no encontrado")

    avatar_data = avatar.data[0]

    supabase.table("user_test_results").insert({
        "user_id": user_id,
        "result": result
    }).execute()

    supabase.table("unlocked_avatars").insert({
        "user_id": user_id,
        "avatar_id": avatar_data["id"]
    }).execute()

    result["unlocked_avatar"] = {
        "id": avatar_data["id"],
        "name": avatar_data["name"],
        "image_url": avatar_data["image_url"],
        "is_new": True
    }

    return result

@router.delete("/reset")
async def reset_test(current_user = Depends(get_current_user)):
    user_id = current_user.id

    # 1. Borrar el resultado del test
    supabase.table("user_test_results").delete().eq("user_id", user_id).execute()

    # 2. BORRAR TAMBIÉN LOS AVATARES DESBLOQUEADOS (ESTO ES LO QUE FALTABA)
    supabase.table("unlocked_avatars").delete().eq("user_id", user_id).execute()

    return {"message": "Test reiniciado correctamente"}

@router.get("/result", response_model=TestResultResponse)
def get_test_result(current_user = Depends(get_current_user)):
    user_id = str(current_user.id)

    query = supabase.table("user_test_results")\
        .select("result")\
        .eq("user_id", user_id)\
        .limit(1)\
        .execute()

    if not query.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Aún no has completado el test de afinidad."
        )

    return query.data[0]["result"]