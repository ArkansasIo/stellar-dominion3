# Xenoberage Session/Auth Handling Outline

## Backend (PHP)
- Implement login endpoint (`POST /api/auth/login`) that returns a session token (JWT or session cookie).
- Protect all game endpoints to require authentication.
- Provide `GET /api/auth/session` to check current session.

## Frontend (TypeScript)
- Store session token in HTTP-only cookie (preferred) or localStorage.
- On app load, check session with `getSession()` API call.
- Redirect to login if not authenticated.
- Attach token to all API requests (if using JWT).

## Security Notes
- Use HTTPS for all requests.
- Set secure, same-site cookie flags if using cookies.
- Never expose sensitive data in frontend code.

---

*This outline ensures secure, modern session and authentication handling for Xenoberage integration.*
