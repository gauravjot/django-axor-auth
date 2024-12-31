---
title: Session vs App Token Authentication
sort: 7
---

Django Axor supports two types of authentication methods: session-based and app token-based. Here is a table that compares the two methods:

| Feature           | Session-based                                                                  | App Token-based                                                                                         |
|-------------------|--------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| Use case          | Web applications                                                               | Mobile applications, IoT devices that cannot make use cookies                                           |
| Security          | Cookies are only valid for certain time, and handled automatically by browser. | App token has to be saved by developer inside the app somewhere safe, preferrably in encrypted storage. |
| Additional Header | _None_                                                                         | `Authorization: Bearer xxx` and `X-Requested-By: mobile_app`                                            |

> [!CAUTION]
> Do not use app tokens in web applications as they are not meant to be stored in the browser. Malicious scripts can easily access them.

> [!TIP]
> The value of `X-Requested-By` header should be anything except the value `web`. If you use `web`, session-based authentication will be used.
> `X-Requested-By` value is for the developer to correctly identify the source of the request. In any case, app-token based authentication will be used to process these requests.
