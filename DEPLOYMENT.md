# Deployment Guide

This document outlines the steps required to deploy SCE Student Portal to production environments.

## Frontend (Vercel)
Vercel is recommended for the React/Vite frontend.

1. Connect your GitHub repository to Vercel.
2. **Build Settings**:
   * Framework Preset: `Vite`
   * Build Command: `npm run build`
   * Output Directory: `dist`
3. **Environment Variables**: Add all `VITE_*` variables.
4. **Deploy**: Vercel handles the CDN distribution automatically.

## Backend (Render)
Render (or Heroku/Railway) is recommended for the FastAPI backend.

1. Connect the repository and select `Web Service`.
2. **Build Settings**:
   * Root Directory: `backend`
   * Runtime: `Python 3.10+`
   * Build Command: `pip install -r requirements.txt`
   * Start Command: `uvicorn api:app --host 0.0.0.0 --port $PORT`
3. **Environment Variables**: Add `DATABASE_URL`, `GROQ_API_KEY`, etc.

## Database (Neon PostgreSQL)
1. Create a project on [Neon.tech](https://neon.tech).
2. Copy the connection string.
3. Replace the local SQLite string with the Neon URL in your `.env` (e.g., `postgresql+psycopg://user:password@ep-cold-pond-1234.us-east-2.aws.neon.tech/neondb?sslmode=require`).
4. **Migrations**: Run `alembic upgrade head` from your backend environment.

## Firebase Authentication
1. Go to Firebase Console > Project Settings > Service Accounts.
2. Generate a new private key.
3. Stringify the JSON and set it as `FIREBASE_CREDENTIALS_JSON` on Render.
4. Add authorized domains (e.g., your Vercel URL) in Firebase Authentication settings.

## Cloudinary
1. Obtain your Cloudinary URL from the dashboard.
2. Set `CLOUDINARY_URL` in the backend for image upload routing.

## CORS Configuration
Ensure your FastAPI CORS middleware explicitly allows the Vercel production URL:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-vercel-domain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Health Checks & Rollback
* **Health Endpoint**: Vercel/Render will ping `/health` to ensure uptime.
* **Rollback**: Vercel allows instant 1-click rollbacks. Render allows reverting to previous successful builds from the dashboard.
