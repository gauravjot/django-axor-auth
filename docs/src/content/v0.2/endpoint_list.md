---
title: Endpoints
sort: 3
---

## User

### Login

- **Endpoint**: `{URI_PREFIX}/user/login/`
- **Method**: `POST`
- **Description**: Login a user.
- **Request**:

  | Field      | Required    | Length | Description                                         |
    | ---------- | ----------- | ------ | --------------------------------------------------- |
  | `email`    | Yes         | <= 150 | Email of the user.                                  |
  | `password` | Yes         | None   | Password of the user.                               |
  | `code`     | Conditional | =6     | TOTP code. It is required if user has TOTP enabled. |

- **Response**:

  | Field                | Type                                                                                   | Description                                                                    |
    | -------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
  | `last_session`       | `django_axor_auth.users.users_sessions.serializers.UserSessionSerializer` or `null`    | Last session information.                                                      |
  | `last_token_session` | `django_axor_auth.users.users_app_tokens.serializers.UserAppTokenSerializer` or `null` | Last token session information.                                                |
  | `user`               | `django_axor_auth.users.serializers.UserSerializer`                                    | User information.                                                              |
  | `session?`           | `{"id": string, "key": string}`                                                        | Session information. Only available if app-token based authentication is used. |

- **Errors**:

    - TOTP token is required but is not provided.

      ```json
      {
          "detail": "TOTP token is required.",
          "status": "401",
          "title": "2FA code is required",
          "code": "TOTPRequired"
      }
      ```

    - Invalid TOTP token.

      ```json
      {
          "detail": "Provided TOTP code or backup code is incorrect. Please try again.",
          "status": "401",
          "title": "2FA code is incorrect",
          "code": "TOTPIncorrect"
      }
      ```

### Register

- **Endpoint**: `{URI_PREFIX}/user/register/`
- **Method**: `POST`
- **Description**: Register a user.
- **Request**:

  | Field        | Required | Length | Description             |
    | ------------ | -------- | ------ | ----------------------- |
  | `email`      | Yes      | <= 150 | Email of the user.      |
  | `password`   | Yes      | Any    | Password of the user.   |
  | `first_name` | Yes      | <= 150 | First name of the user. |
  | `last_name`  | Yes      | <= 150 | Last name of the user.  |

- **Response**:

  | Field                | Type                                                | Description                                                                    |
    | -------------------- | --------------------------------------------------- | ------------------------------------------------------------------------------ |
  | `last_session`       | `null`                                              | Last session information.                                                      |
  | `last_token_session` | `null`                                              | Last token session information.                                                |
  | `user`               | `django_axor_auth.users.serializers.UserSerializer` | User information.                                                              |
  | `session?`           | `{"id": string, "key": string}`                     | Session information. Only available if app-token based authentication is used. |

### Logout

- **Endpoint**: `{URI_PREFIX}/user/logout/`
- **Method**: `POST`
- **Description**: Logout a user.
- **Request**: Empty.

### Current User

- **Endpoint**: `{URI_PREFIX}/user/me/`
- **Method**: `GET`
- **Description**: Get the current authenticated user.
