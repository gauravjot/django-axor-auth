from django.db import models
from django.utils.timezone import now


class UserManager(models.Manager):
    def __init__(self):
        super().__init__()

    def create_user(self, password, **extra_fields):
        user = self.model(**extra_fields)
        user.set_password(password)
        user.save()
        return user


class UserPasswordChangeManager(models.Manager):
    def __init__(self):
        super().__init__()

    def save_due_forgot_password_form(self, user):
        """Create a row in the UserPasswordChange table for the user who forgot their password.

        Args:
            user (User): User object
        """
        self.create(
            user=user,
            date=now(),
            method='forgot_password',
        )
