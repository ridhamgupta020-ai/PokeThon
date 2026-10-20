from dataclasses import dataclass

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.auth.jwt import InvalidToken, verify_token
from app.database import get_db

bearer = HTTPBearer(auto_error=False)


@dataclass
class CurrentUser:
    id: str
    email: str
    role: str  # always read from the trusted profiles table, never from the request


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> CurrentUser:
    if creds is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        claims = verify_token(creds.credentials)
    except InvalidToken:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")

    uid = claims["sub"]
    res = get_db().table("profiles").select("id,email,role").eq("id", uid).limit(1).execute()
    if not res.data:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Profile not found")
    row = res.data[0]
    return CurrentUser(id=row["id"], email=row["email"], role=row["role"])


def require_admin(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if user.role != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Administrator access required")
    return user
