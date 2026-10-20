from datetime import datetime, timezone

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status

from app.database import get_db
from app.dependencies.auth import CurrentUser, get_current_user
from app.models import PARTICIPANT_EDITABLE
from app.schemas.misc import ProfileUpdate, ProjectUpsert, TeamCreate, TeamJoin
from app.schemas.registration import RegistrationCreate, RegistrationOut, RegistrationUpdate
from app.services import email as mail
from app.services.registrations import assert_registration_open, create_registration

router = APIRouter(prefix="/api", tags=["participant"])


# --- profile ---------------------------------------------------------------
@router.get("/profile/me")
def my_profile(user: CurrentUser = Depends(get_current_user)):
    res = get_db().table("profiles").select("*").eq("id", user.id).limit(1).execute()
    return res.data[0]


@router.patch("/profile/me")
def update_profile(body: ProfileUpdate, user: CurrentUser = Depends(get_current_user)):
    # Only full_name is ever written; role/email cannot be supplied.
    res = get_db().table("profiles").update({"full_name": body.full_name}).eq("id", user.id).execute()
    return res.data[0]


# --- registration -----------------------------------------------------------
@router.post("/registrations", response_model=RegistrationOut, status_code=status.HTTP_201_CREATED)
def register(body: RegistrationCreate, bg: BackgroundTasks, user: CurrentUser = Depends(get_current_user)):
    assert_registration_open()
    # Email always comes from the verified identity, not the request body.
    row = create_registration(user.id, user.email, body.to_row())
    bg.add_task(mail.notify_registration, row["email"], row["full_name"], row["registration_number"])
    return row


@router.get("/registrations/me", response_model=RegistrationOut)
def my_registration(user: CurrentUser = Depends(get_current_user)):
    res = get_db().table("registrations").select("*").eq("user_id", user.id).limit(1).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "You have not registered yet")
    return res.data[0]


@router.patch("/registrations/me", response_model=RegistrationOut)
def update_my_registration(body: RegistrationUpdate, user: CurrentUser = Depends(get_current_user)):
    data = body.model_dump(mode="json", exclude_none=True)
    data = {k: v for k, v in data.items() if k in PARTICIPANT_EDITABLE}
    if not data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nothing to update")
    res = get_db().table("registrations").update(data).eq("user_id", user.id).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "You have not registered yet")
    return res.data[0]


# --- teams --------------------------------------------------------------------
def _my_team(user_id: str):
    db = get_db()
    m = db.table("team_members").select("team_id").eq("user_id", user_id).limit(1).execute()
    if not m.data:
        return None
    tid = m.data[0]["team_id"]
    team = db.table("teams").select("*").eq("id", tid).limit(1).execute().data[0]
    ids = [r["user_id"] for r in db.table("team_members").select("user_id").eq("team_id", tid).execute().data]
    team["members"] = db.table("profiles").select("id,full_name,email").in_("id", ids).execute().data
    team["is_leader"] = team["team_leader_id"] == user_id
    return team


@router.get("/teams/me")
def my_team(user: CurrentUser = Depends(get_current_user)):
    return _my_team(user.id)


@router.post("/teams", status_code=status.HTTP_201_CREATED)
def create_team(body: TeamCreate, user: CurrentUser = Depends(get_current_user)):
    db = get_db()
    if _my_team(user.id):
        raise HTTPException(status.HTTP_409_CONFLICT, "You are already in a team")
    team = db.table("teams").insert({"team_name": body.team_name.strip(), "team_leader_id": user.id}).execute().data[0]
    db.table("team_members").insert({"team_id": team["id"], "user_id": user.id}).execute()
    return _my_team(user.id)


@router.post("/teams/join")
def join_team(body: TeamJoin, user: CurrentUser = Depends(get_current_user)):
    db = get_db()
    if _my_team(user.id):
        raise HTTPException(status.HTTP_409_CONFLICT, "You are already in a team")
    t = db.table("teams").select("id").eq("team_code", body.team_code.strip().upper()).limit(1).execute()
    if not t.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invalid team code")
    tid = t.data[0]["id"]
    size = db.table("team_members").select("id", count="exact").eq("team_id", tid).execute().count or 0
    if size >= 6:
        raise HTTPException(status.HTTP_409_CONFLICT, "That team is full")
    db.table("team_members").insert({"team_id": tid, "user_id": user.id}).execute()
    return _my_team(user.id)


@router.delete("/teams/me/membership", status_code=status.HTTP_204_NO_CONTENT)
def leave_team(user: CurrentUser = Depends(get_current_user)):
    db = get_db()
    team = _my_team(user.id)
    if not team:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "You are not in a team")
    if team["is_leader"]:
        # Leader leaving disbands the team (project and memberships cascade)
        db.table("teams").delete().eq("id", team["id"]).execute()
    else:
        db.table("team_members").delete().eq("team_id", team["id"]).eq("user_id", user.id).execute()


# --- projects -------------------------------------------------------------------
@router.get("/projects/me")
def my_project(user: CurrentUser = Depends(get_current_user)):
    team = _my_team(user.id)
    if not team:
        return None
    res = get_db().table("projects").select("*").eq("team_id", team["id"]).limit(1).execute()
    return res.data[0] if res.data else None


@router.put("/projects/me")
def upsert_project(body: ProjectUpsert, user: CurrentUser = Depends(get_current_user)):
    team = _my_team(user.id)
    if not team:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Create or join a team before submitting a project")
    db = get_db()
    existing = db.table("projects").select("*").eq("team_id", team["id"]).limit(1).execute().data
    if existing and existing[0]["submission_status"] in ("accepted", "rejected", "under_review"):
        raise HTTPException(status.HTTP_409_CONFLICT, "This submission is locked while under review")
    data = body.model_dump(mode="json", exclude={"submit"})
    if body.submit:
        data["submission_status"] = "submitted"
        data["submitted_at"] = datetime.now(timezone.utc).isoformat()
    if existing:
        res = db.table("projects").update(data).eq("id", existing[0]["id"]).execute()
    else:
        res = db.table("projects").insert({**data, "team_id": team["id"]}).execute()
    return res.data[0]


# --- announcements ----------------------------------------------------------------
@router.get("/announcements")
def announcements(_: CurrentUser = Depends(get_current_user)):
    res = (
        get_db().table("announcements").select("*").eq("published", True)
        .order("created_at", desc=True).limit(50).execute()
    )
    return res.data
