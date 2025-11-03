# routes/auth.py
from fastapi import APIRouter, HTTPException, status
from models.auth_models import RegisterModel, LoginModel, RegisterVerificationResponse, AuthSuccessResponse
from db.supabase_client import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", status_code=status.HTTP_201_CREATED, response_model=RegisterVerificationResponse)
def register_user(user: RegisterModel):
    try:
        response = supabase.auth.sign_up({
            "email": user.email,
            "password": user.password,
            "options": {
                "data": {"username": user.username,
                         "full_name": user.full_name,
                         "bio": user.bio,
                         "phone": user.phone,
                         "social_links": user.social_links or {}
                         }
            }
        })

        # Caso 1: Necesita confirmar email
        if response.user and not response.user.confirmed_at:
            return {
                "message": "Registro exitoso. Por favor, verifica tu correo electrónico.",
                "user_id": str(response.user.id)
            }

        # Caso 2: Login automático (email ya confirmado o dev mode)
        return {
            "message": "Registro y login exitoso.",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in,
            "user_id": str(response.user.id)
        }

    except Exception as e:
        error_msg = str(e).lower()
        if "email rate limit" in error_msg:
            raise HTTPException(status.HTTP_429_TOO_MANY_REQUESTS, "Demasiados intentos.")
        if "password" in error_msg:
            raise HTTPException(status.HTTP_400_BAD_REQUEST, "Contraseña inválida (mín. 6 caracteres).")
        if "already registered" in error_msg:
            raise HTTPException(status.HTTP_409_CONFLICT, "Este email ya está registrado.")
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Error: {str(e)}")

@router.post("/login", response_model=AuthSuccessResponse)
def login_user(user: LoginModel):
    try:
        response = supabase.auth.sign_in_with_password({
            "email": user.email,
            "password": user.password
        })
        return {
            "message": "Inicio de sesión exitoso.",
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
            "expires_in": response.session.expires_in,
            "user_id": str(response.user.id)
        }
    except Exception as e:
        if "invalid login credentials" in str(e).lower():
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Credenciales inválidas.")
        raise HTTPException(status.HTTP_400_BAD_REQUEST, f"Error: {str(e)}")