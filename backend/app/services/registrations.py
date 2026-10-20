from datetime import datetime, timezone

from fastapi import HTTPException, status

from app.database import get_db


def get_event() -> dict:
    res = get_db().table("event_settings").select("*").limit(1).execute()
    return res.data[0] if res.data else {}


def assert_registration_open() -> None:
    ev = get_event()
    if not ev.get("registration_open", True):
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Registration is closed")
    deadline = ev.get("registration_deadline")
    if deadline:
        dl = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
        if datetime.now(timezone.utc) > dl:
            raise HTTPException(status.HTTP_403_FORBIDDEN, "The registration deadline has passed")


def create_registration(user_id: str, email: str, data: dict) -> dict:
    db = get_db()
    dup = db.table("registrations").select("id").or_(f"user_id.eq.{user_id},email.ilike.{email}").limit(1).execute()
    if dup.data:
        raise HTTPException(status.HTTP_409_CONFLICT, "A registration already exists for this email")
    row = {**data, "user_id": user_id, "email": email.lower()}
    try:
        res = db.table("registrations").insert(row).execute()
    except Exception as exc:  # unique violation race
        if "duplicate" in str(exc).lower() or "23505" in str(exc):
            raise HTTPException(status.HTTP_409_CONFLICT, "A registration already exists for this email")
        raise
    if not res.data:
        raise HTTPException(status.HTTP_500_INTERNAL_SERVER_ERROR, "Registration could not be saved")
    return res.data[0]
