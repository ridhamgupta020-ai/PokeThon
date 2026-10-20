from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field, HttpUrl


class ProfileUpdate(BaseModel):
    full_name: str = Field(min_length=2, max_length=120)


class TeamCreate(BaseModel):
    team_name: str = Field(min_length=2, max_length=80)


class TeamJoin(BaseModel):
    team_code: str = Field(min_length=4, max_length=16)


class ProjectUpsert(BaseModel):
    title: str = Field(min_length=2, max_length=150)
    description: str = Field(min_length=10, max_length=5000)
    repository_url: HttpUrl | None = None
    demo_url: HttpUrl | None = None
    submit: bool = False


class ProjectStatusUpdate(BaseModel):
    submission_status: str = Field(pattern="^(draft|submitted|under_review|accepted|rejected)$")


class AnnouncementIn(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    content: str = Field(min_length=2, max_length=5000)
    published: bool = False


class AnnouncementPatch(BaseModel):
    title: str | None = Field(default=None, min_length=2, max_length=200)
    content: str | None = Field(default=None, min_length=2, max_length=5000)
    published: bool | None = None


class EventSettingsUpdate(BaseModel):
    event_name: str | None = Field(default=None, min_length=2, max_length=120)
    event_date: datetime | None = None
    registration_deadline: datetime | None = None
    registration_open: bool | None = None
    description: str | None = Field(default=None, max_length=5000)
    # schedule, prizes, faq, sponsors, themes, contact, social links
    content: dict[str, Any] | None = None
