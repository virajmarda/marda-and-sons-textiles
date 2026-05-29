## Admin token
`ADMIN_TOKEN=marda-atelier-2026` (set in `backend/.env`)

## How to use
1. Visit `/admin/leads` on the site
2. Enter the admin token
3. Token is stored in `localStorage` under key `marda_admin_token_v1` for the session
4. Sign out clears the token

## Rotating the token
1. Update `ADMIN_TOKEN` in `backend/.env`
2. `sudo supervisorctl restart backend`
3. Each existing admin browser will be auto-signed-out on next request (401 → token cleared)

## Production note
For production deployment, set `ADMIN_TOKEN` to a long random string (e.g. `openssl rand -hex 32`).
