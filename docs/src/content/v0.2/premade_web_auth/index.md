---
title: In-built Auth Pages
sort: 4
---

These pages are provided to lighten the development workload for this library's users. They are provided to perform basic functionality and have limited customization options.

## Setup

Go to `settings.py` file and add the following to the `INSTALLED_APPS` list:

```python
INSTALLED_APPS = [
    ...
    'django_axor_auth.web_auth',
    ...
]
```

Then, add the following to the `urls.py` file:

```python
path('auth/', include('django_axor_auth.web_auth.urls'))
```

You should be able to navigate to http://localhost:8000/auth/ and see the login page.

## Page List

- Sign In
- Magic Link Sign In
- [Sign Out](premade_web_auth/signout)
- Forgot Password - Request and Process
- Email Verification - Process

These are **only available for session-based authentication**, i.e. only web.