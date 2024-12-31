---
title: Setting up Django Axor
sort: 2
---

## Django Settings

Go to your Django project's settings file and add the following:

```python
INSTALLED_APPS = [
    ...
    'django_axor_auth',
    ...
]
```

In the middleware section, add the following:

```python
MIDDLEWARE = [
    ...

    # Apply on request
    # # required
    "django_axor_auth.middlewares.HeaderRequestedByMiddleware",
    "django_axor_auth.users.middlewares.ActiveUserMiddleware",
    # # optional
    "django_axor_auth.extras.middlewares.VerifyRequestOriginMiddleware",
    "django_axor_auth.extras.middlewares.ValidateJsonMiddleware",

    # Apply on response
    "django_axor_auth.logs.middlewares.APILogMiddleware",
]
```

Configure settings for the library by using `AXOR_AUTH` in your Django project's settings file:

```python
AXOR_AUTH = dict(
    # General
    APP_NAME="your_app_name",
    FRONTEND_URL="http://localhost:3000",
    URI_PREFIX="/api",  # URI prefix for all API endpoints

    # Cookies
    AUTH_COOKIE_NAME='axor_auth',
    AUTH_COOKIE_AGE=60 * 60 * 24 * 7,  # 1 week
    AUTH_COOKIE_SECURE=True,
    AUTH_COOKIE_SAMESITE='Strict',
    AUTH_COOKIE_DOMAIN='localhost',

    # Forgot password
    FORGET_PASSWORD_LINK_TIMEOUT=30,  # in minutes
    FORGET_PASSWORD_LOCKOUT_TIME=24,  # in hours

    # TOTP
    TOTP_NUM_OF_BACKUP_CODES=8,
    TOTP_BACKUP_CODE_LENGTH=8,

    # Email
    SMTP_USE_TLS=True,
    SMTP_USE_SSL=False,
    SMTP_HOST="smtp.office365.com",
    SMTP_PORT=587,
    SMTP_USER="your_email",
    SMTP_PASSWORD="your_password",
    SMTP_DEFAULT_SEND_FROM="no-reply@your_domain.com",
)
```

## Adding to URLs

Add the following to your Django project's `urls.py` file:

```python
from django.urls import path, include

urlpatterns = [
    ...
    path('api/user/', include('django_axor_auth.users.urls')),
    ...
]
```

## Database Migrations

Run the following command to apply the migrations:

```bash
python manage.py makemigrations django_axor_auth
python manage.py migrate
```

## Test Setup

Run this command to register a user:

```bash
curl -X POST http://localhost:8000/api/user/register/ \
-H "Content-Type: application/json" \
-d '{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@test.com",
  "password": "Pass1234!"
}'
```

You should see a result similar to this:

```json
{
	"last_session": null,
	"last_token_session": null,
	"user": {
		"id": "08a2980d-010b-475c-83b9-4baae89ee401",
		"is_active": true,
		"created_at": "2024-11-21T03:13:49.940284Z",
		"first_name": "John",
		"last_name": "Doe",
		"timezone": "America/Vancouver",
		"updated_at": "2024-11-21T03:13:49.940300Z",
		"email": "john@test.com",
		"created_by": null,
		"updated_by": null
	}
}
```

Congratulations! You have successfully set up Django Axor. You can now start using the library to manage users in your Django project.
