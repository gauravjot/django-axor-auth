from datetime import timedelta
from django.db import models
from django.utils.timezone import now
from .utils import hash_this
from .managers import ForgotPasswordManager
from ..models import User
from django_axor_auth.configurator import config


class ForgotPassword(models.Model):
    token = models.CharField(max_length=150)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    is_valid = models.BooleanField(default=True)
    is_used = models.BooleanField(default=False)
    source_ip = models.GenericIPAddressField()
    source_ua = models.TextField()
    created_at = models.DateTimeField(default=now)
    updated_at = models.DateTimeField(default=now)

    class Meta:
        db_table = 'axor_forgot_password'
        ordering = ['-created_at']

    objects = ForgotPasswordManager()

    def __str__(self):
        return self.user.email

    def set_token(self, token):
        self.token = hash_this(token)
        self.save()

    def check_token(self, token):
        return hash_this(token) == self.token

    def check_valid(self):
        # Check if used
        if self.is_used:
            return False
        # Check if token was created more than x minutes ago
        if (now() - self.created_at) > timedelta(seconds=config.FORGET_PASSWORD_LINK_TIMEOUT):
            self.is_valid = False
            self.save()
            return False
        return self.is_valid

    def set_used(self):
        self.is_used = True
        self.is_valid = False
        self.save()
