from tests.conftest import auth


def test_health(client):
    assert client.get("/health").json() == {"status": "ok"}


def test_register_requires_auth(client, valid_reg):
    assert client.post("/api/registrations", json=valid_reg).status_code == 401


def test_register_success_uses_token_email_and_returns_id(client, db, valid_reg):
    valid_reg["email"] = "attacker@example.com"  # must be ignored
    r = client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    assert r.status_code == 201
    body = r.json()
    assert body["registration_number"].startswith("PT-")
    assert body["email"] == "alice@example.com"
    assert body["status"] == "pending"
    assert body["phone"] == "+919876543210"
    assert len(db.tables["registrations"]) == 1


def test_duplicate_registration_rejected(client, valid_reg):
    assert client.post("/api/registrations", json=valid_reg, headers=auth("user-1")).status_code == 201
    r = client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    assert r.status_code == 409


def test_cannot_set_status_or_role_on_register(client, db, valid_reg):
    valid_reg["status"] = "approved"
    valid_reg["role"] = "admin"
    r = client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    assert r.status_code == 201
    assert r.json()["status"] == "pending"
    assert db.tables["profiles"][0]["role"] == "participant"


def test_validation_errors_are_field_specific(client, valid_reg):
    valid_reg["phone"] = "12345"
    valid_reg["github_url"] = "https://example.com/alice"
    valid_reg["accept_terms"] = False
    r = client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    assert r.status_code == 422
    fields = r.json()["fields"]
    assert "phone" in fields and "github_url" in fields and "accept_terms" in fields


def test_team_requires_name_and_size(client, valid_reg):
    valid_reg["participation_type"] = "team"
    r = client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    assert r.status_code == 422
    valid_reg.update(team_name="Pixel Pirates", team_size=3)
    assert client.post("/api/registrations", json=valid_reg, headers=auth("user-1")).status_code == 201


def test_registration_closed(client, db, valid_reg):
    db.tables["event_settings"][0]["registration_open"] = False
    r = client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    assert r.status_code == 403


def test_deadline_passed(client, db, valid_reg):
    db.tables["event_settings"][0]["registration_deadline"] = "2020-01-01T00:00:00+00:00"
    assert client.post("/api/registrations", json=valid_reg, headers=auth("user-1")).status_code == 403


def test_participant_cannot_edit_protected_fields(client, valid_reg):
    client.post("/api/registrations", json=valid_reg, headers=auth("user-1"))
    r = client.patch("/api/registrations/me", json={"status": "approved"}, headers=auth("user-1"))
    assert r.status_code == 400  # nothing editable supplied
    r = client.patch("/api/registrations/me", json={"city": "Noida"}, headers=auth("user-1"))
    assert r.status_code == 200 and r.json()["city"] == "Noida"
    assert r.json()["status"] == "pending"


def test_profile_update_cannot_change_role(client, db):
    r = client.patch("/api/profile/me", json={"full_name": "Alice B", "role": "admin"}, headers=auth("user-1"))
    assert r.status_code == 200
    assert db.tables["profiles"][0]["role"] == "participant"


def test_status_lookup_needs_number_and_email(client, valid_reg):
    number = client.post("/api/registrations", json=valid_reg, headers=auth("user-1")).json()["registration_number"]
    ok = client.get("/api/registrations/status", params={"number": number, "email": "alice@example.com"})
    assert ok.status_code == 200 and ok.json() == {"registration_number": number, "status": "pending"}
    bad = client.get("/api/registrations/status", params={"number": number, "email": "other@example.com"})
    assert bad.status_code == 404
