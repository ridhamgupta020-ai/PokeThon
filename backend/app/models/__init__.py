"""Domain constants. Table shapes live in supabase/migrations; Pydantic schemas in app/schemas."""

REGISTRATION_STATUSES = ("pending", "approved", "rejected")
PROJECT_STATUSES = ("draft", "submitted", "under_review", "accepted", "rejected")
ROLES = ("participant", "admin")

# Columns a participant is allowed to edit on their own registration
PARTICIPANT_EDITABLE = (
    "full_name", "phone", "college", "course", "study_year", "city", "state",
    "github_url", "linkedin_url", "skills", "project_idea",
)
