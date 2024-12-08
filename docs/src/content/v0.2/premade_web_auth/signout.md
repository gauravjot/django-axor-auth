---
title: Sign Out
---

The component is available at endpoint `/auth/signout`.

To customize, you can provide following options query parameters with the endpoint:

- `redirect`: URL to redirect after successful sign-out. Default is FRONTEND_URL that you provide in settings.
- `referrer`: URL that if user decides to cancel sign-out, they can be redirected back to. Default is the FRONTEND_URL
  that you provide in settings.

## Examples

```
/auth/signout?redirect=https://domain.local&referrer=https://domain.local/dashboard
```

Scenarios:

- If user signs out successfully, they will be redirected to `https://domain.local`.
- If user cancels sign-out, they will be redirected to `https://domain.local/dashboard`.


