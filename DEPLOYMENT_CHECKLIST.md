# Deployment Checklist

Before announcing CampusOS as "live", ensure the following checklist is completed.

## Frontend
- [ ] Build succeeds locally (`npm run build`).
- [ ] No ESLint or TypeScript errors.
- [ ] Vercel branch is set to `main`.
- [ ] All `VITE_*` environment variables are loaded in Vercel settings.

## Backend
- [ ] `requirements.txt` is up to date (`pip freeze > requirements.txt`).
- [ ] Tests pass (`pytest tests/`).
- [ ] Render Web Service is connected and auto-deploy is configured.
- [ ] All backend `.env` variables are loaded in Render.

## Database
- [ ] Neon PostgreSQL project is active.
- [ ] Migrations are up to date (`alembic upgrade head`).
- [ ] Mock data is successfully seeded.

## Security & Firebase
- [ ] Firebase Auth domain restrictions are updated to include your Vercel production URL.
- [ ] `FIREBASE_CREDENTIALS_JSON` contains no newline parsing errors on Render.

## Monitoring & Health
- [ ] Frontend loads and redirects to Login.
- [ ] `/health` endpoint on Render returns `200 OK`.
- [ ] Uptime monitoring (e.g., BetterStack / Pingdom) is tracking the `/health` endpoint.

## Rollback Procedure
If deployment causes critical errors:
1. Revert to the last stable deployment inside the Vercel dashboard.
2. Trigger a rollback to the previous commit on Render.
3. Inform the dev team via Slack/Teams.
