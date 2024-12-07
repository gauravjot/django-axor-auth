from pathlib import Path
from decouple import config
from django.core.mail import get_connection

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config(
    'SECRET_KEY', default='django-insecure$&!9x6t7m7q2^q1l7c@z5@2!&1!v1c7zq^r#_b2z9#q^w3q9z')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = config('DEBUG', default=False, cast=bool)

ALLOWED_HOSTS = ['*']

# ----- Custom App Settings
#
# These settings are used in the project to customize the behavior of the app.
# ---------------------------------------------------------------------------

# General
APP_NAME = 'Django Boilerplate'
# User app
FORGET_PASSWORD_LINK_TIMEOUT = 30  # minutes
FORGET_PASSWORD_LOCKOUT_TIME = 24  # hours (To prevent bad actors)
TOTP_NUM_OF_BACKUP_CODES = 8
TOTP_BACKUP_CODE_LENGTH = 8  # keep it more than 6 to differentiate from TOTP code

AXOR_AUTH = dict(
    APP_NAME=APP_NAME,
    APP_LOGO='/static/axor/full_logo.svg',
    AUTH_COOKIE_NAME='axor_auth',
    AUTH_COOKIE_AGE=60 * 60 * 24 * 7,  # 1 week
    AUTH_COOKIE_SECURE=config('AUTH_COOKIE_SECURE', default=False, cast=bool),
    AUTH_COOKIE_SAMESITE=config('AUTH_COOKIE_SAMESITE', default='Lax'),
    AUTH_COOKIE_DOMAIN=config('AUTH_COOKIE_DOMAIN', default=None),
    FORGET_PASSWORD_LINK_TIMEOUT=FORGET_PASSWORD_LINK_TIMEOUT,
    FORGET_PASSWORD_LOCKOUT_TIME=FORGET_PASSWORD_LOCKOUT_TIME,
    TOTP_NUM_OF_BACKUP_CODES=TOTP_NUM_OF_BACKUP_CODES,
    TOTP_BACKUP_CODE_LENGTH=TOTP_BACKUP_CODE_LENGTH,
    SMTP_USE_TLS=config('SMTP_USE_TLS', default=False, cast=bool),
    SMTP_USE_SSL=config('SMTP_USE_SSL', default=False, cast=bool),
    SMTP_HOST=config('SMTP_HOST', default=None),
    SMTP_PORT=config('SMTP_PORT', default=None),
    SMTP_USER=config('SMTP_USER', default=None),
    SMTP_PASSWORD=config('SMTP_PASSWORD', default=None),
    SMTP_DEFAULT_SEND_FROM=config('SMTP_DEFAULT_SEND_FROM', default=None),
    FRONTEND_URL=config('FRONTEND_URL', default=None),
)


# Email
# https://docs.djangoproject.com/en/5.0/topics/email/

# EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# ----- Django Settings
#
# These settings are used by Django to configure the project. Do not change
# these settings unless you know what you are doing.
# Configuration of these settings is done in the .env file.
# ---------------------------------------------------------------------------

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
PROJECT_BASE_DIR = BASE_DIR

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'rest_framework',

    # logs
    'django_axor_auth.logs',

    # users
    'django_axor_auth.users',
    'django_axor_auth.users.users_sessions',
    'django_axor_auth.users.users_totp',
    'django_axor_auth.users.users_forgot_password',
    'django_axor_auth.users.users_app_tokens',
    'django_axor_auth.users.users_magic_link',
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    'corsheaders.middleware.CorsMiddleware',
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",

    # Apply on request
    # # required
    "django_axor_auth.middlewares.HeaderRequestedByMiddleware",
    "django_axor_auth.users.middlewares.ActiveUserMiddleware",
    # # extras
    "django_axor_auth.extras.middlewares.VerifyRequestOriginMiddleware",
    "django_axor_auth.extras.middlewares.ValidateJsonMiddleware",

    # Apply on response
    "django_axor_auth.logs.middlewares.APILogMiddleware",
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'django_axor_auth' / 'web_auth' / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Security

CORS_ALLOWED_ORIGINS = [config('FRONTEND_URL')]
CSRF_TRUSTED_ORIGINS = [config('FRONTEND_URL')]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = (
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
)

CORS_ALLOW_HEADERS = (
    "accept",
    "authorization",
    "content-type",
    "user-agent",
    "x-csrftoken",
    "x-requested-with",
)

# Set the origins that API will respond to.
# To set all origins, use value ['*']
ALLOW_ORIGINS = [config('FRONTEND_URL')]


# Database
def get_database():
    if config('DB_HOST', default=None) is None or config('DB_HOST', default=None) == '':
        Path(str(PROJECT_BASE_DIR) +
             "/db").mkdir(parents=True, exist_ok=True)
        return {
            'default': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': PROJECT_BASE_DIR / 'db' / 'db.sqlite3',
            }
        }
    else:
        return {
            'default': {
                'ENGINE': 'django.db.backends.postgresql',
                'NAME': config('DB_NAME'),
                'USER': config('DB_USERNAME'),
                'PASSWORD': config('DB_PASSWORD'),
                'HOST': config('DB_HOST'),
                'PORT': config('DB_PORT'),
            }
        }


# If no database is provided, use sqlite3
DATABASES = {
    **get_database()
}


def getEmailConnection():
    if config('SMTP_USE_TLS') == 'True':
        return get_connection(
            host=config('SMTP_HOST'),
            port=config('SMTP_PORT'),
            username=config('SMTP_USER'),
            password=config('SMTP_PASSWORD'),
            use_tls=True,
        )
    else:
        return get_connection(
            host=config('SMTP_HOST'),
            port=config('SMTP_PORT'),
            username=config('SMTP_USER'),
            password=config('SMTP_PASSWORD'),
            use_ssl=True,
        )


# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = False
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = "static/"

STATICFILES_DIRS = [
    BASE_DIR / "django_axor_auth" / "static"
]

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
