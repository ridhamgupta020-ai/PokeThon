import itertools
import os
import uuid
from datetime import datetime, timezone

os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "test")

import pytest
from fastapi.testclient import TestClient


class Result:
    def __init__(self, data, count=None):
        self.data = data
        self.count = count


class Query:
    def __init__(self, db, name):
        self.db, self.name = db, name
        self.rows = db.tables.setdefault(name, [])
        self.filters = []
        self.op = "select"
        self.payload = None
        self.want_count = False
        self._order = None
        self._range = None
        self._limit = None

    # builders -----------------------------------------------------------
    def select(self, *_a, count=None, **_k):
        self.want_count = bool(count)
        return self

    def insert(self, payload):
        self.op, self.payload = "insert", payload
        return self

    def update(self, payload):
        self.op, self.payload = "update", payload
        return self

    def delete(self):
        self.op = "delete"
        return self

    def eq(self, k, v):
        self.filters.append(lambda r: r.get(k) == v)
        return self

    def neq(self, k, v):
        self.filters.append(lambda r: r.get(k) != v)
        return self

    def ilike(self, k, v):
        needle = v.strip("%").lower()
        if "%" in v.strip("%") or v.startswith("%") or v.endswith("%"):
            self.filters.append(lambda r: needle in str(r.get(k, "")).lower())
        else:
            self.filters.append(lambda r: str(r.get(k, "")).lower() == needle)
        return self

    def in_(self, k, vals):
        self.filters.append(lambda r: r.get(k) in vals)
        return self

    def or_(self, expr):
        conds = []
        for part in expr.split(","):
            col, op, val = part.split(".", 2)
            conds.append((col, op, val.strip("%").lower()))

        def match(r):
            for col, op, val in conds:
                cell = str(r.get(col, "")).lower()
                if (op == "eq" and cell == val) or (op == "ilike" and val in cell):
                    return True
            return False

        self.filters.append(match)
        return self

    def order(self, col, desc=False):
        self._order = (col, desc)
        return self

    def range(self, a, b):
        self._range = (a, b)
        return self

    def limit(self, n):
        self._limit = n
        return self

    # execution ----------------------------------------------------------
    def execute(self):
        if self.op == "insert":
            row = self.db.apply_defaults(self.name, dict(self.payload))
            self.db.check_unique(self.name, row)
            self.rows.append(row)
            return Result([row])
        matched = [r for r in self.rows if all(f(r) for f in self.filters)]
        if self.op == "update":
            for r in matched:
                r.update(self.payload)
            return Result([dict(r) for r in matched])
        if self.op == "delete":
            for r in matched:
                self.rows.remove(r)
            return Result([dict(r) for r in matched])
        total = len(matched)
        if self._order:
            col, desc = self._order
            matched.sort(key=lambda r: str(r.get(col, "")), reverse=desc)
        if self._range:
            matched = matched[self._range[0] : self._range[1] + 1]
        if self._limit is not None:
            matched = matched[: self._limit]
        return Result([dict(r) for r in matched], total if self.want_count else None)


class FakeDB:
    def __init__(self):
        self.tables: dict[str, list[dict]] = {}
        self._seq = itertools.count(1001)

    def table(self, name):
        return Query(self, name)

    def apply_defaults(self, name, row):
        now = datetime.now(timezone.utc).isoformat()
        row.setdefault("id", str(uuid.uuid4()))
        if name == "registrations":
            row.setdefault("registration_number", f"PT-2026-{next(self._seq):05d}")
            row.setdefault("status", "pending")
            row.setdefault("admin_notes", None)
            row.setdefault("linkedin_url", None)
            row.setdefault("team_name", None)
            row.setdefault("project_idea", None)
            row["created_at"] = row["updated_at"] = now
        if name == "teams":
            row.setdefault("team_code", uuid.uuid4().hex[:8].upper())
        if name == "projects":
            row.setdefault("submission_status", "draft")
        return row

    def check_unique(self, name, row):
        if name == "registrations":
            for r in self.tables.get("registrations", []):
                if r["user_id"] == row["user_id"] or r["email"].lower() == row["email"].lower():
                    raise Exception("23505 duplicate key value")


@pytest.fixture
def db(monkeypatch):
    fake = FakeDB()
    fake.tables["profiles"] = [
        {"id": "user-1", "email": "alice@example.com", "role": "participant", "full_name": "Alice"},
        {"id": "user-2", "email": "bob@example.com", "role": "participant", "full_name": "Bob"},
        {"id": "admin-1", "email": "admin@example.com", "role": "admin", "full_name": "Admin"},
    ]
    fake.tables["event_settings"] = [
        {"id": "ev", "event_name": "Pocket Thon", "registration_open": True, "registration_deadline": None}
    ]
    for mod in (
        "app.dependencies.auth",
        "app.routes.public",
        "app.routes.participant",
        "app.routes.admin",
        "app.services.registrations",
    ):
        monkeypatch.setattr(f"{mod}.get_db", lambda f=fake: f)
    # The bearer token IS the user id in tests; the role still comes from the profiles table.
    monkeypatch.setattr("app.dependencies.auth.verify_token", lambda t: {"sub": t})
    return fake


@pytest.fixture
def client(db):
    from app.main import app

    return TestClient(app, raise_server_exceptions=False)


def auth(user_id: str) -> dict:
    return {"Authorization": f"Bearer {user_id}"}


VALID_REG = {
    "full_name": "Alice Sharma",
    "phone": "+91 98765 43210",
    "college": "ABC Institute of Technology",
    "course": "B.Tech CSE",
    "study_year": 3,
    "city": "Ghaziabad",
    "state": "Uttar Pradesh",
    "github_url": "https://github.com/alice",
    "linkedin_url": "https://www.linkedin.com/in/alice",
    "skills": ["Python", "React"],
    "participation_type": "individual",
    "accept_terms": True,
    "accept_privacy": True,
}


@pytest.fixture
def valid_reg():
    return dict(VALID_REG)
