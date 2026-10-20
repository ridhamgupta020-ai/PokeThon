import csv
import io
import re

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Query, Response, status

from app.database import get_db
from app.dependencies.auth import CurrentUser, require_admin
from app.schemas.misc import (
    AnnouncementIn,
    AnnouncementPatch,
    EventSettingsUpdate,
    ProjectStatusUpdate,
)
from app.schemas.registration import NotesUpdate, StatusUpdate
from app.services import email as mail

# Every route in this router requires a verified administrator.
router = APIRouter(prefix="/api/admin", tags=["admin"], dependencies=[Depends(require_admin)])

SORTABLE = {"created_at", "full_name", "college", "status", "registration_number"}
CSV_COLUMNS = [
    "registration_number", "full_name", "email", "phone", "college", "course", "study_year",
    "city", "state", "github_url", "linkedin_url", "skills", "participation_type",
    "team_name", "team_size", "project_idea", "status", "admin_notes", "created_at",
]


def _count(table: str, **eq) -> int:
    q = get_db().table(table).select("id", count="exact").limit(1)
    for k, v in eq.items():
        q = q.eq(k, v)
    return q.execute().count or 0


def _safe_term(term: str) -> str:
    # strip characters that have meaning in PostgREST filter syntax
    return re.sub(r"[,()%*\\]", " ", term).strip()


def _filtered(q, search, status_, course, college, ptype):
    if status_:
        q = q.eq("status", status_)
    if ptype:
        q = q.eq("participation_type", ptype)
    if course:
        q = q.ilike("course", f"%{_safe_term(course)}%")
    if college:
        q = q.ilike("college", f"%{_safe_term(college)}%")
    if search:
        t = _safe_term(search)
        if t:
            q = q.or_(
                f"full_name.ilike.%{t}%,email.ilike.%{t}%,registration_number.ilike.%{t}%,college.ilike.%{t}%"
            )
    return q


# --- stats -----------------------------------------------------------------------
@router.get("/stats")
def stats():
    db = get_db()
    verified = 0
    try:
        page = 1
        while True:
            users = db.auth.admin.list_users(page=page, per_page=1000)
            if not users:
                break
            verified += sum(1 for u in users if getattr(u, "email_confirmed_at", None))
            if len(users) < 1000:
                break
            page += 1
    except Exception:  # noqa: BLE001
        verified = -1
    return {
        "total_registrations": _count("registrations"),
        "verified_participants": verified,
        "pending": _count("registrations", status="pending"),
        "approved": _count("registrations", status="approved"),
        "rejected": _count("registrations", status="rejected"),
        "total_teams": _count("teams"),
        "project_submissions": (
            get_db().table("projects").select("id", count="exact").neq("submission_status", "draft").limit(1)
            .execute().count or 0
        ),
    }


# --- registrations -----------------------------------------------------------------
@router.get("/registrations")
def list_registrations(
    search: str | None = None,
    status_filter: str | None = Query(default=None, alias="status", pattern="^(pending|approved|rejected)$"),
    course: str | None = None,
    college: str | None = None,
    participation_type: str | None = Query(default=None, pattern="^(individual|team)$"),
    sort: str = "created_at",
    order: str = Query(default="desc", pattern="^(asc|desc)$"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
):
    if sort not in SORTABLE:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Invalid sort field")
    q = get_db().table("registrations").select("*", count="exact")
    q = _filtered(q, search, status_filter, course, college, participation_type)
    start = (page - 1) * page_size
    res = q.order(sort, desc=(order == "desc")).range(start, start + page_size - 1).execute()
    return {"items": res.data, "total": res.count or 0, "page": page, "page_size": page_size}


@router.get("/registrations/export.csv")
def export_csv(
    search: str | None = None,
    status_filter: str | None = Query(default=None, alias="status", pattern="^(pending|approved|rejected)$"),
    course: str | None = None,
    college: str | None = None,
    participation_type: str | None = Query(default=None, pattern="^(individual|team)$"),
):
    q = get_db().table("registrations").select("*")
    q = _filtered(q, search, status_filter, course, college, participation_type)
    rows = q.order("created_at", desc=True).limit(10000).execute().data

    def safe(v):
        if isinstance(v, list):
            v = "; ".join(map(str, v))
        s = "" if v is None else str(v)
        # neutralise spreadsheet formula injection
        return "'" + s if s[:1] in ("=", "+", "-", "@") else s

    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(CSV_COLUMNS)
    for r in rows:
        w.writerow([safe(r.get(c)) for c in CSV_COLUMNS])
    return Response(
        buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="pocketthon-registrations.csv"'},
    )


@router.get("/registrations/{reg_id}")
def get_registration(reg_id: str):
    res = get_db().table("registrations").select("*").eq("id", reg_id).limit(1).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Registration not found")
    return res.data[0]


@router.patch("/registrations/{reg_id}/status")
def set_status(reg_id: str, body: StatusUpdate, bg: BackgroundTasks):
    res = get_db().table("registrations").update({"status": body.status}).eq("id", reg_id).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Registration not found")
    r = res.data[0]
    bg.add_task(mail.notify_status_change, r["email"], r["full_name"], r["registration_number"], r["status"])
    return r


@router.patch("/registrations/{reg_id}/notes")
def set_notes(reg_id: str, body: NotesUpdate):
    res = get_db().table("registrations").update({"admin_notes": body.admin_notes}).eq("id", reg_id).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Registration not found")
    return res.data[0]


@router.delete("/registrations/{reg_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_registration(reg_id: str, confirm: bool = Query(default=False)):
    if not confirm:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Deletion requires confirm=true")
    res = get_db().table("registrations").delete().eq("id", reg_id).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Registration not found")


# --- teams & projects ------------------------------------------------------------------
@router.get("/teams")
def list_teams():
    db = get_db()
    teams = db.table("teams").select("*").order("created_at", desc=True).limit(1000).execute().data
    members = db.table("team_members").select("team_id").execute().data
    counts: dict[str, int] = {}
    for m in members:
        counts[m["team_id"]] = counts.get(m["team_id"], 0) + 1
    for t in teams:
        t["member_count"] = counts.get(t["id"], 0)
    return teams


@router.delete("/teams/{team_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_team(team_id: str, confirm: bool = Query(default=False)):
    if not confirm:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Deletion requires confirm=true")
    get_db().table("teams").delete().eq("id", team_id).execute()


@router.get("/projects")
def list_projects():
    db = get_db()
    projects = db.table("projects").select("*, teams(team_name,team_code)").order("updated_at", desc=True).execute()
    return projects.data


@router.patch("/projects/{project_id}/status")
def set_project_status(project_id: str, body: ProjectStatusUpdate):
    res = get_db().table("projects").update({"submission_status": body.submission_status}).eq("id", project_id).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Project not found")
    return res.data[0]


# --- announcements ----------------------------------------------------------------------
@router.get("/announcements")
def list_announcements():
    return get_db().table("announcements").select("*").order("created_at", desc=True).execute().data


@router.post("/announcements", status_code=status.HTTP_201_CREATED)
def create_announcement(body: AnnouncementIn):
    return get_db().table("announcements").insert(body.model_dump()).execute().data[0]


@router.patch("/announcements/{ann_id}")
def update_announcement(ann_id: str, body: AnnouncementPatch):
    data = body.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nothing to update")
    res = get_db().table("announcements").update(data).eq("id", ann_id).execute()
    if not res.data:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Announcement not found")
    return res.data[0]


@router.delete("/announcements/{ann_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_announcement(ann_id: str):
    get_db().table("announcements").delete().eq("id", ann_id).execute()


# --- event settings --------------------------------------------------------------------
@router.put("/event")
def update_event(body: EventSettingsUpdate):
    data = body.model_dump(mode="json", exclude_unset=True)
    if not data:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Nothing to update")
    db = get_db()
    current = db.table("event_settings").select("id").limit(1).execute().data
    if current:
        res = db.table("event_settings").update(data).eq("id", current[0]["id"]).execute()
    else:
        res = db.table("event_settings").insert(data).execute()
    return res.data[0]


@router.get("/me")
def admin_me(user: CurrentUser = Depends(require_admin)):
    return {"id": user.id, "email": user.email, "role": user.role}
