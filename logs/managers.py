import json
import uuid
from django.db import models
from users.users_sessions.utils import get_active_session
from users.users_app_tokens.utils import get_active_token


class LogManager(models.Manager):
    def __init__(self):
        super().__init__()

    def create_log(self, request, response):
        """Create a Log entry in the database

        Args:
            request: HTTP request object
            response (dict): Response in format of LogResponse.serialize()
            user (User, optional): User who is performing the action. Defaults to logged-in user or None.
        """
        status = response['s']
        response.pop('s', None)
        session = get_active_session(request)
        app_token = get_active_token(request)
        log = self.model(
            url=request.get_full_path(),
            status=status,
            response=json.dumps(response),
            session_id=uuid.UUID(
                str(session.id)) if session is not None else None,
            app_token_id=uuid.UUID(
                str(app_token.id)) if app_token is not None else None,

        )
        log.save()
