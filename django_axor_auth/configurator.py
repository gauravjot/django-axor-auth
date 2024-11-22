from django.conf import settings
from typing import Any
from .utils.extras import get_if_present


_config = {
    # General
    "APP_NAME": get_if_present(settings.AXOR_AUTH, 'APP_NAME', 'Django Axor Auth'),
    "URI_PREFIX": get_if_present(settings.AXOR_AUTH, 'URI_PREFIX', '/api'),
    "FRONTEND_URL": get_if_present(settings.AXOR_AUTH, 'FRONTEND_URL', None),
    "IS_REGISTRATION_ENABLED": get_if_present(settings.AXOR_AUTH, 'IS_REGISTRATION_ENABLED', True),

    # Cookies
    "AUTH_COOKIE_NAME": get_if_present(settings.AXOR_AUTH, 'AUTH_COOKIE_NAME', 'axor_auth'),
    # 30 days
    "AUTH_COOKIE_AGE": get_if_present(settings.AXOR_AUTH, 'AUTH_COOKIE_AGE', 60 * 60 * 24 * 30),
    "AUTH_COOKIE_SECURE": get_if_present(settings.AXOR_AUTH, 'AUTH_COOKIE_SECURE', False),
    "AUTH_COOKIE_SAMESITE": get_if_present(settings.AXOR_AUTH, 'AUTH_COOKIE_SAMESITE', 'SameSite'),
    "AUTH_COOKIE_DOMAIN": get_if_present(settings.AXOR_AUTH, 'AUTH_COOKIE_DOMAIN', None),

    # Email Verification
    # 30 mins
    "EMAIL_VERIFICATION_LINK_TIMEOUT": get_if_present(settings.AXOR_AUTH, 'EMAIL_VERIFICATION_LINK_TIMEOUT', 30 * 60),
    "EMAIL_VERIFICATION_LINK": get_if_present(settings.AXOR_AUTH, 'EMAIL_VERIFICATION_LINK', 'verify-email?token=<token>'),

    # Forgot Password
    # 30 mins
    "FORGET_PASSWORD_LINK_TIMEOUT": get_if_present(settings.AXOR_AUTH, 'FORGET_PASSWORD_LINK_TIMEOUT', 30),
    # 24 hrs
    "FORGET_PASSWORD_LOCKOUT_TIME": get_if_present(settings.AXOR_AUTH, 'FORGET_PASSWORD_LOCKOUT_TIME', 24),

    # TOTP
    "TOTP_NUM_OF_BACKUP_CODES": get_if_present(settings.AXOR_AUTH, 'TOTP_NUM_OF_BACKUP_CODES', 8),
    "TOTP_BACKUP_CODE_LENGTH": get_if_present(settings.AXOR_AUTH, 'TOTP_BACKUP_CODE_LENGTH', 8),

    # SMTP
    "SMTP_USE_TLS": get_if_present(settings.AXOR_AUTH, 'SMTP_USE_TLS', True),
    "SMTP_USE_SSL": get_if_present(settings.AXOR_AUTH, 'SMTP_USE_SSL', False),
    "SMTP_HOST": get_if_present(settings.AXOR_AUTH, 'SMTP_HOST', None),
    "SMTP_PORT": get_if_present(settings.AXOR_AUTH, 'SMTP_PORT', None),
    "SMTP_USER": get_if_present(settings.AXOR_AUTH, 'SMTP_USER', None),
    "SMTP_PASSWORD": get_if_present(settings.AXOR_AUTH, 'SMTP_PASSWORD', None),
    "SMTP_DEFAULT_SEND_FROM": get_if_present(settings.AXOR_AUTH, 'SMTP_DEFAULT_SEND_FROM', None),
}


class Config:
    APP_NAME: str
    URI_PREFIX: str
    FRONTEND_URL: str
    IS_REGISTRATION_ENABLED: bool
    AUTH_COOKIE_NAME: str
    AUTH_COOKIE_AGE: int
    AUTH_COOKIE_SECURE: bool
    AUTH_COOKIE_SAMESITE: str
    AUTH_COOKIE_DOMAIN: str
    EMAIL_VERIFICATION_LINK_TIMEOUT: int
    EMAIL_VERIFICATION_LINK: str
    FORGET_PASSWORD_LINK_TIMEOUT: int
    FORGET_PASSWORD_LOCKOUT_TIME: int
    TOTP_NUM_OF_BACKUP_CODES: int
    TOTP_BACKUP_CODE_LENGTH: int
    SMTP_USE_TLS: bool
    SMTP_USE_SSL: bool
    SMTP_HOST: str
    SMTP_PORT: str
    SMTP_USER: str
    SMTP_PASSWORD: str
    SMTP_DEFAULT_SEND_FROM: str

    def __init__(self, data: dict[str, Any]):
        for key, value in data.items():
            setattr(self, key, value)


# Create an instance of Config with the dictionary data
config = Config(_config)
