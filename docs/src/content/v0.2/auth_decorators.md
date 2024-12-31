---
title: Authentication Decorators
sort: 8
---

This page will guide you how you can protect your API endpoints using Django Axor, such that only authenticated users can access them.

## Permission Decorator

In your `views.py` file, use the `@permission_classes` decorator to protect your API endpoints.

```python
from rest_framework.decorators import api_view, permission_classes
from django_axor_auth.users.permissions import IsAuthenticated

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def some_endpoint(request):
    ...
    # Return response
    return Response(status=200)
```

This endpoint will only be accessible to all authenticated users irrespective of the authentication method used.

## Permission Classes

Django Axor provides the following permission classes:

- `IsAuthenticated`: Allows access only to authenticated users.
- `IsAuthenticatedSessionCookie`: Allows access only to authenticated users using session cookies.
- `IsAuthenticatedAppToken`: Allows access only to authenticated users using app tokens.
