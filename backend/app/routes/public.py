from fastapi import APIRouter, HTTPException, Query, status

from app.database import get_db
from app.schemas.registration import StatusLookupOut
from app.services.registrations import get_event

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok"}


@router.get("/api/event")
def event():
    return get_event()


@router.get("/api/stats/public")
def public_stats():
    db = get_db()
    regs = db.table("registrations").select("id", count="exact").limit(1).execute().count or 0
    teams = db.table("teams").select("id", count="exact").limit(1).execute().count or 0
    projects = (
        db.table("projects").select("id", count="exact").neq("submission_status", "draft").limit(1).execute().count or 0
    )
    return {"participants": regs, "teams": teams, "projects": projects}


@router.get("/api/registrations/status", response_model=StatusLookupOut)
def lookup_status(number: str = Query(min_length=4, max_length=32), email: str = Query(min_length=3, max_length=254)):
    """Public status lookup. Needs BOTH the registration number and the email; returns status only."""
    res = (
        get_db().table("registrations").select("registration_number,status")
        .eq("registration_number", number.strip().upper()).ilike("email", email.strip()).limit(1).execute()
    )
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "No registration found for those details")
    return res.data[0]
