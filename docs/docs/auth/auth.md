##
If cookies are used for storage of access and refresh tokens, the only way to avoid sending the renewal cookie on every request in the browser would be to avoid using "with credentials" during XHR requests and instead rely on a bearer token perhaps coming from a non-httpOnly cookie (now XSS is a concern).

When refresh is needed, withCredentials could be used.

With HTTPS perhaps the exposure in transport isn't really a valid concern.