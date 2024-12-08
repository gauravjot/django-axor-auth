---
title: Current Authenticated User
---

To get the current authenticated user, you can use the `get_current_user` method from the `django_axor_auth.users.utils` module.

```python
...
from django_axor_auth.users.api import get_request_user

@api_view(['GET'])
def some_endpoint(request):
    ...
    user = get_request_user(request)
    ...
```

The user object is attached to the request object by the `ActiveUserMiddleware` middleware. It differs based on the authentication method used.

- For app token based: `request.active_token`
- For session based: `request.active_session`
