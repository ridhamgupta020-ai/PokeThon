import re
from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr, Field, HttpUrl, field_validator, model_validator

PHONE_RE = re.compile(r"^\+?[0-9]{10,15}$")


def _clean_phone(v: str) -> str:
    v = re.sub(r"[\s\-()]", "", v)
    if not PHONE_RE.match(v):
        raise ValueError("Enter a valid phone number (10-15 digits, optional +)")
    return v


class RegistrationBase(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)
    phone: str
    college: str = Field(min_length=2, max_length=200)
    course: str = Field(min_length=2, max_length=100)
    study_year: int = Field(ge=1, le=8)
    city: str = Field(min_length=2, max_length=100)
    state: str = Field(min_length=2, max_length=100)
    github_url: HttpUrl
    linkedin_url: HttpUrl | None = None
    skills: list[str] = Field(min_length=1, max_length=30)
    participation_type: Literal["individual", "team"]
    team_name: str | None = Field(default=None, max_length=80)
    team_size: int = Field(default=1, ge=1, le=6)
    project_idea: str | None = Field(default=None, max_length=2000)

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str) -> str:
        return _clean_phone(v)

    @field_validator("full_name", "college", "course", "city", "state")
    @classmethod
    def _strip(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("Too short")
        return v

    @field_validator("github_url")
    @classmethod
    def _github(cls, v: HttpUrl) -> HttpUrl:
        if (v.host or "").lower() not in ("github.com", "www.github.com"):
            raise ValueError("Must be a github.com profile URL")
        return v

    @field_validator("linkedin_url")
    @classmethod
    def _linkedin(cls, v: HttpUrl | None) -> HttpUrl | None:
        if v is not None and "linkedin.com" not in (v.host or "").lower():
            raise ValueError("Must be a linkedin.com URL")
        return v

    @field_validator("skills")
    @classmethod
    def _skills(cls, v: list[str]) -> list[str]:
        out = [s.strip() for s in v if s.strip()]
        if not out:
            raise ValueError("Add at least one skill")
        return out[:30]

    @model_validator(mode="after")
    def _team_rules(self):
        if self.participation_type == "individual":
            self.team_name = None
            self.team_size = 1
        else:
            if not self.team_name or not self.team_name.strip():
                raise ValueError("Team name is required for team participation")
            if self.team_size < 2:
                raise ValueError("Team size must be at least 2")
        return self

    def to_row(self) -> dict:
        d = self.model_dump(mode="json")
        return d


class RegistrationCreate(RegistrationBase):
    accept_terms: Literal[True]
    accept_privacy: Literal[True]

    def to_row(self) -> dict:
        d = super().to_row()
        d.pop("accept_terms", None)
        d.pop("accept_privacy", None)
        return d


class RegistrationUpdate(BaseModel):
    """Fields a participant may edit after registering."""

    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    phone: str | None = None
    college: str | None = Field(default=None, min_length=2, max_length=200)
    course: str | None = Field(default=None, min_length=2, max_length=100)
    study_year: int | None = Field(default=None, ge=1, le=8)
    city: str | None = Field(default=None, min_length=2, max_length=100)
    state: str | None = Field(default=None, min_length=2, max_length=100)
    github_url: HttpUrl | None = None
    linkedin_url: HttpUrl | None = None
    skills: list[str] | None = Field(default=None, max_length=30)
    project_idea: str | None = Field(default=None, max_length=2000)

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str | None) -> str | None:
        return _clean_phone(v) if v is not None else v


class RegistrationOut(BaseModel):
    id: str
    registration_number: str
    full_name: str
    email: str
    phone: str
    college: str
    course: str
    study_year: int
    city: str
    state: str
    github_url: str
    linkedin_url: str | None = None
    skills: list[str]
    participation_type: str
    team_name: str | None = None
    team_size: int
    project_idea: str | None = None
    status: str
    created_at: datetime
    updated_at: datetime


class StatusLookupOut(BaseModel):
    registration_number: str
    status: str


class AdminRegistrationOut(RegistrationOut):
    user_id: str
    admin_notes: str | None = None


class StatusUpdate(BaseModel):
    status: Literal["pending", "approved", "rejected"]


class NotesUpdate(BaseModel):
    admin_notes: str = Field(max_length=5000)
