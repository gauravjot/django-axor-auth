from django.db import models
from django.utils.timezone import now
from .managers import LogManager
from users.users_sessions.models import Session
from users.users_app_tokens.models import AppToken


class ApiCallLog(models.Model):
    # API URL that the user is trying to access
    url = models.CharField(max_length=255)
    # Response brief for success or error
    # Example: {"status": 200, "message": "Success"}
    # Use LogResponse.serialize() to serialize the response
    response = models.JSONField(null=True, blank=True)
    # Active session when user is performing the action
    # For login and signup, session_id is None. Instead,
    # 'response' column will have 'session_started' key.
    session = models.ForeignKey(
        Session, on_delete=models.DO_NOTHING, null=True, blank=True)
    app_token = models.ForeignKey(
        AppToken, on_delete=models.DO_NOTHING, null=True, blank=True)
    status = models.IntegerField()
    created_at = models.DateTimeField(default=now)

    objects = LogManager()

    def __str__(self):
        return str(self.pk) + ' - ' + self.url
