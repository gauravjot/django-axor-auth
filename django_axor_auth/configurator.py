from django.conf import settings
from typing import Any
from .utils.extras import get_if_present

_config = {
    # General
    "APP_NAME": get_if_present(settings.AXOR_AUTH, 'APP_NAME', 'Django Axor Auth'),
    "URI_PREFIX": get_if_present(settings.AXOR_AUTH, 'URI_PREFIX', '/api'),

    # Cookies
    "AUTH_COOKIE_NAME": get_if_present(settings.AXOR_AUTH, 'AUTH_COOKIE_NAME', 'axor_auth'),
}


class Config:
    APP_NAME: str
    URI_PREFIX: str
    AUTH_COOKIE_NAME: str

    def __init__(self, data: dict[str, Any]):
        for key, value in data.items():
            setattr(self, key, value)


# Create an instance of Config with the dictionary data
config = Config(_config)
