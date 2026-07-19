# SCE Campus Fresher Portal - Deployment Guide

## Frontend (Vercel)
1. Push the repository to GitHub.
2. Import the `frontend/` directory into Vercel.
3. Configure Environment Variables:
   - `VITE_API_BASE_URL`: URL of the deployed backend (e.g., `https://backend.onrender.com`)
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, etc., from your Firebase console.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click Deploy.

## Backend (Render)
1. Create a new Web Service in Render connected to your repository.
2. Root Directory: `backend/`
3. Environment: `Python 3`
4. Build Command: `pip install -r requirements.txt && alembic upgrade head`
5. Start Command: `uvicorn api:app --host 0.0.0.0 --port 10000`
6. Configure Environment Variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string.
   - `GROQ_API_KEY`: Your Groq API key for the AI model.
   - `CLOUDINARY_URL`: Your Cloudinary connection string.
   - `GOOGLE_APPLICATION_CREDENTIALS`: Raw JSON string or path to Firebase Service Account JSON.
7. Click Deploy.

## Database (Neon PostgreSQL)
- Create a project in Neon.
- Copy the provided connection string and paste it into Render's `DATABASE_URL`.
- Alembic will automatically create the tables on the first build using the command above.

## Media (Cloudinary)
- Create a free Cloudinary account.
- Copy the `CLOUDINARY_URL` (API Environment variable) to Render.

## AI & Vector Store
- ChromaDB runs in-memory and persists to disk. On Render, you may need a Persistent Disk attached to `/data` and `/chroma_db` to ensure your vector indexes survive deployments, or re-run `/rebuild` after deployment.
