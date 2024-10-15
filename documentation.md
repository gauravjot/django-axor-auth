# API Documentation

## Users

<table>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
<th>Request</th>
<th>Response</th>
<th>Errors</th>
</tr>
<tr>
<td>POST</td>
<td>

`/login`

</td>
<td>Authenticate user with application</td>
<td>

```json
{
	"email": "string",
	"password": "string"
}
```

Provide `token` as well if 2FA is enabled. Status code `401` will be returned if 2FA is enabled and `token` is not provided.

</td>
<td>

-   If MFA is set to required but user does not have it set, provide one time auth token to setup MFA. Status code `202`.

    ```json
    {
    	"mfa_join_token": "some_token",
    	"detail": "MFA is required.",
    	"reason": "MFA_REQUIRED"
    }
    ```

-   Login is successful and cookie is set. Status code `200`.

    ```json
    {
    	"last_session": "LAST_COOKIE_SESSION_INFO",
    	"last_token_session": "LAST_TOKEN_SESSION_INFO",
    	"user": "USER_INFO"
    }
    ```

-   Login is successful and token is returned. Status code `200`.

    ```json
    {
    	"last_session": "LAST_COOKIE_SESSION_INFO",
    	"last_token_session": "LAST_TOKEN_SESSION_INFO",
    	"user": "USER_INFO",
    	"session": {
    		"id": "SESSION_ID",
    		"key": "SESSION_TOKEN"
    	}
    }
    ```

</td>
<td>

-   TOTP token is required but is not provided.

    ```json
    {
    	"detail": "TOTP token is required.",
    	"status": "401",
    	"title": "2FA code is required",
    	"code": "TOTPRequired"
    }
    ```

-   Invalid TOTP token.

    ```json
    {
    	"detail": "Provided TOTP code or backup code is incorrect. Please try again.",
    	"status": "401",
    	"title": "2FA code is incorrect",
    	"code": "TOTPIncorrect"
    }
    ```

</td>
</tr>
</table>
