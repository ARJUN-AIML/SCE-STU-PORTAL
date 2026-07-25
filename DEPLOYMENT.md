# Deployment Guide

This document outlines the production deployment for the SCE Student Portal (**Railway** for backend & **Neon PostgreSQL** for database, **Vercel** for frontend).

## Frontend (Vercel)
Vercel hosts the React/Vite frontend.

1. Connect your GitHub repository to Vercel.
2. **Build Settings**:
   * Framework Preset: `Vite`
   * Root Directory: `frontend`
   * Build Command: `npm run build`
   * Output Directory: `dist`
3. **Environment Variables**:
   * `VITE_API_BASE_URL`: `https://protective-balance-production-5b44.up.railway.app` (or your Railway backend domain)
   * `VITE_FIREBASE_*` credentials.
4. **Deploy**: Vercel handles global deployment automatically.

## Backend (Railway)
Railway hosts the FastAPI backend with multi-worker ASGI performance and reverse proxy header trust.

1. Connect your GitHub repository to **Railway**.
2. **Service Settings**:
   * Root Directory: `backend` (or repo root)
   * Build Command: Automatic via `nixpacks.toml` / `railway.json`
   * Start Command: `alembic upgrade head && uvicorn api:app --host 0.0.0.0 --port $PORT --workers 2 --proxy-headers --forwarded-allow-ips='*'`
3. **Environment Variables**:
   * `DATABASE_URL`: Your Neon PostgreSQL pooler URL (`postgresql+psycopg://user:pass@ep-pooler.neon.tech/neondb?sslmode=require`)
   * `GROQ_API_KEY`: Groq LLM API Key
   * `FIREBASE_CREDENTIALS_JSON`: Stringified JSON of Firebase Admin service account key
   * `CORS_ORIGINS`: Comma-separated allowed frontend domains (e.g., `https://sce-stu-portal.vercel.app`)

## Database (Neon PostgreSQL)
1. Create a project on [Neon.tech](https://neon.tech).
2. Copy the connection pooler URL.
3. Set `DATABASE_URL` in Railway variables (e.g., `postgresql+psycopg://user:pass@ep-pooler.neon.tech/neondb?sslmode=require`).
4. Connection pooling, `pool_pre_ping=True`, `pool_recycle=180`, TCP keepalives, and automatic `alembic upgrade head` migrations on deploy ensure zero-downtime database startup.

## Firebase Authentication
1. Go to Firebase Console > Project Settings > Service Accounts.
2. Generate a new private key.
3. Stringify the JSON and set it as `FIREBASE_CREDENTIALS_JSON` on Railway.
4. Add authorized domains (e.g., your Vercel URL and Railway URL) in Firebase Authentication settings.

## Cloudinary
1. Obtain your Cloudinary URL from the dashboard.
2. Set `CLOUDINARY_URL` in Railway backend environment variables for image upload routing.

## Health Checks & Monitoring
* **Health Endpoint**: Railway continuously pings `/health` to verify database connectivity and AI assistant state.
* **Rollback**: Railway allows instant 1-click rollbacks from the project deployment timeline.

