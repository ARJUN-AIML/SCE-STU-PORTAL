# Deployment Checklist

Before announcing SCE Student Portal as "live", ensure the following checklist is completed.

## Frontend (Vercel)
- [ ] Build succeeds locally (`npm run build`).
- [ ] No ESLint or TypeScript errors.
- [ ] Vercel branch is set to `main`.
- [ ] `VITE_API_BASE_URL` points to your active Railway backend URL.
- [ ] All `VITE_*` environment variables are loaded in Vercel settings.

## Backend (Railway)
- [ ] `requirements.txt` is up to date.
- [ ] `railway.json`, `Procfile`, and `nixpacks.toml` are committed.
- [ ] Railway Web Service is connected and auto-deploy is enabled.
- [ ] All backend `.env` variables (`DATABASE_URL`, `GROQ_API_KEY`, `FIREBASE_CREDENTIALS_JSON`) are configured in Railway environment settings.

## Database (Neon PostgreSQL)
- [ ] Neon PostgreSQL project is active and connection string uses `sslmode=require`.
- [ ] Auto-migrations execute on build (`alembic upgrade head`).
- [ ] Mock / Production data is successfully seeded.

## Security & Firebase
- [ ] Firebase Auth domain restrictions are updated to include your Vercel production URL and Railway backend URL.
- [ ] `FIREBASE_CREDENTIALS_JSON` contains valid stringified JSON on Railway.

## Monitoring & Health
- [ ] Frontend loads and connects to Railway API.
- [ ] `/health` endpoint on Railway returns `"status": "ready"` and `"database": {"connected": true}`.
- [ ] Railway deployment logs display clean startup with 0 errors.

## Rollback Procedure
If deployment causes critical errors:
1. Revert to the last stable deployment inside the Vercel dashboard for frontend.
2. Trigger a rollback to the previous deployment build in Railway dashboard for backend.

