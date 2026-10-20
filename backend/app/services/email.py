"""Optional email notifications via Resend. Silently skipped when not configured;
failures are logged and never break the request that triggered them."""
import logging

import httpx

from app.config import get_settings

log = logging.getLogger("pocketthon.email")


def send_email(to: str, subject: str, html: str) -> bool:
    s = get_settings()
    if not s.resend_api_key or not to:
        return False
    try:
        r = httpx.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {s.resend_api_key}"},
            json={"from": s.email_from, "to": [to], "subject": subject, "html": html},
            timeout=10,
        )
        r.raise_for_status()
        return True
    except Exception:  # noqa: BLE001
        log.exception("email send failed", extra={"to": to})
        return False


def notify_registration(email: str, name: str, number: str) -> None:
    s = get_settings()
    send_email(
        email,
        "Pocket Thon registration received",
        f"<p>Hi {name},</p><p>Your registration ID is <b>{number}</b>. "
        "We'll email you when your status changes.</p>",
    )
    if s.admin_notify_email:
        send_email(
            s.admin_notify_email,
            "New Pocket Thon registration",
            f"<p>{name} ({email}) registered: <b>{number}</b></p>",
        )


def notify_status_change(email: str, name: str, number: str, status: str) -> None:
    send_email(
        email,
        f"Pocket Thon registration {status}",
        f"<p>Hi {name},</p><p>Your registration <b>{number}</b> is now <b>{status}</b>.</p>",
    )
