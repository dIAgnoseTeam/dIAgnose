import logging
from datetime import datetime, timezone

audit_logger = logging.getLogger("audit")

def log_admin_action(user_id: int, action: str, resource: str, resource_id=None, details=None):
    audit_logger.info(
        "AUDIT user_id=%s action=%s resource=%s resource_id=%s details=%s timestamp=%s",
        user_id, action, resource, resource_id, details, datetime.now(timezone.utc).isoformat()
    )