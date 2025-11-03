# auth/dependencies.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from db.supabase_client import supabase

# 1. Crea un "esquema" de seguridad: espera "Bearer <token>"
security = HTTPBearer()

# 2. Esta función se usa con Depends() en cualquier endpoint
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Extrae el JWT del header y lo valida con Supabase.
    Devuelve el objeto `user` si es válido.
    """
    # 3. El token viene como: "eyJhbGciOi..."
    token = credentials.credentials

    try:
        # 4. Supabase valida el JWT y devuelve el usuario
        user_response = supabase.auth.get_user(token)
        return user_response.user  # ← Este es el usuario real

    except Exception as e:
        # 5. Si el token es inválido, expirado, etc.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
            headers={"WWW-Authenticate": "Bearer"}
        )