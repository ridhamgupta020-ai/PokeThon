import pytest

from tests.conftest import auth

ADMIN_GETS = [
    "/api/admin/stats",
    "/api/admin/registrations",
    "/api/admin/registrations/export.csv",
    "/api/admin/teams",
    "/api/admin/projects",
    "/api/admin/announcements",
]


@pytest.mark.parametrize("path", ADMIN_GETS)
def test_admin_endpoints_reject_anonymous(client, path):
    assert client.get(path).status_code == 401


@pytest.mark.parametrize("path", ADMIN_GETS)
def test_admin_endpoints_reject_participants(client, path):
    assert client.get(path, headers=auth("user-1")).status_code == 403


def test_admin_mutations_reject_participants(client):
    h = auth("user-1")
    assert client.patch("/api/admin/registrations/x/status", json={"status": "approved"}, headers=h).status_code == 403
    assert client.delete("/api/admin/registrations/x?confirm=true", headers=h).status_code == 403
    assert client.put("/api/admin/event", json={"registration_open": False}, headers=h).status_code == 403
    assert client.post("/api/admin/announcements", json={"title": "hi", "content": "all"}, headers=h).status_code == 403


def test_full_flow_register_then_admin_approves(client, valid_reg):
    reg = client.post("/api/registrations", json=valid_reg, headers=auth("user-1")).json()

    listing = client.get("/api/admin/registrations", headers=auth("admin-1")).json()
    assert listing["total"] == 1

    r = client.patch(f"/api/admin/registrations/{reg['id']}/status", json={"status": "approved"}, headers=auth("admin-1"))
    assert r.status_code == 200 and r.json()["status"] == "approved"

    mine = client.get("/api/registrations/me", headers=auth("user-1")).json()
    assert mine["status"] == "approved"

    stats = client.get("/api/admin/stats", headers=auth("admin-1")).json()
    assert stats["total_registrations"] == 1 and stats["approved"] == 1 and stats["pending"] == 0


def test_admin_search_and_filter(client, valid_reg):
    client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    other = dict(valid_reg, full_name="Bob Verma", college="XYZ University")
    client.post("/api/registrations", json=other, headers=auth("user-2"))
    h = auth("admin-1")
    assert client.get("/api/admin/registrations", params={"search": "bob"}, headers=h).json()["total"] == 1
    assert client.get("/api/admin/registrations", params={"college": "xyz"}, headers=h).json()["total"] == 1
    assert client.get("/api/admin/registrations", params={"status": "rejected"}, headers=h).json()["total"] == 0
    assert client.get("/api/admin/registrations", params={"sort": "password"}, headers=h).status_code == 400


def test_invalid_status_rejected(client, valid_reg):
    reg = client.post("/api/registrations", json=valid_reg, headers=auth("user-1")).json()
    r = client.patch(f"/api/admin/registrations/{reg['id']}/status", json={"status": "superadmin"}, headers=auth("admin-1"))
    assert r.status_code == 422


def test_delete_requires_confirmation(client, valid_reg):
    reg = client.post("/api/registrations", json=valid_reg, headers=auth("user-1")).json()
    h = auth("admin-1")
    assert client.delete(f"/api/admin/registrations/{reg['id']}", headers=h).status_code == 400
    assert client.delete(f"/api/admin/registrations/{reg['id']}?confirm=true", headers=h).status_code == 204


def test_csv_export_neutralises_formulas(client, valid_reg):
    valid_reg["full_name"] = "=HYPERLINK(\"http://evil\")"
    client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    r = client.get("/api/admin/registrations/export.csv", headers=auth("admin-1"))
    assert r.status_code == 200 and r.headers["content-type"].startswith("text/csv")
    assert "'=HYPERLINK" in r.text


def test_announcements_visible_to_participants_only_when_published(client):
    h = auth("admin-1")
    client.post("/api/admin/announcements", json={"title": "Draft", "content": "secret", "published": False}, headers=h)
    client.post("/api/admin/announcements", json={"title": "Live", "content": "hello", "published": True}, headers=h)
    items = client.get("/api/announcements", headers=auth("user-1")).json()
    assert [a["title"] for a in items] == ["Live"]


def test_admin_updates_event_settings(client, db):
    r = client.put("/api/admin/event", json={"registration_open": False, "event_name": "PT 2026"}, headers=auth("admin-1"))
    assert r.status_code == 200
    assert client.get("/api/event").json()["registration_open"] is False
