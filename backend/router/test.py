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
        raise HTTPException(403, "Ya completaste el test. Usa /test/reset.")

    result = calculate_affinity(answers)

    supabase.table("user_test_results").insert({
        "user_id": user_id,
        "result": result
    }).execute()

    return result

@router.delete("/reset", status_code=status.HTTP_200_OK)
def reset_test(current_user = Depends(get_current_user)):
    user_id = str(current_user.id)

    check = supabase.table("user_test_results")\
        .select("id")\
        .eq("user_id", user_id)\
        .limit(1)\
        .execute()

    if not check.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No tienes un test completado para resetear."
        )

    supabase.table("user_test_results")\
        .delete()\
        .eq("user_id", user_id)\
        .execute()

    return {"message": "Test reseteado con éxito. ¡Puedes volver a tomarlo!"}

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