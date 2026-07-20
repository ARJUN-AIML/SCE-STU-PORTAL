# Setup Guides

## Alembic Migration Guide
Alembic is configured in `backend/alembic.ini` and `backend/alembic/env.py` to point to the `Base` metadata in `models/models.py`.
1. **Initialize Migration**: `alembic revision --autogenerate -m "Initial schema"`
2. **Apply Migration**: `alembic upgrade head`
*(Note: If `DATABASE_URL` uses SQLite during local dev, `api.py` automatically generates tables via `create_all()`).*

## Firebase Setup Guide
1. Go to Firebase Console and create a new project.
2. Enable Authentication (Google & Email/Password).
3. Under Project Settings, generate a new Web App configuration.
4. Copy the config keys to `frontend/.env.local` (`VITE_FIREBASE_API_KEY`, etc.).
5. Under Service Accounts, generate a new Private Key JSON.
6. Set the `GOOGLE_APPLICATION_CREDENTIALS` environment variable in the backend to the path of this JSON file.

## Neon PostgreSQL Setup Guide
1. Create a Neon account and project.
2. Create a database (e.g., `sce-portal`).
3. Copy the pooled connection string.
4. Set `DATABASE_URL=postgresql://user:password@ep-cold-shadow-1234.us-east-2.aws.neon.tech/sce-portal` in `backend/.env`.

## Cloudinary Setup Guide
1. Create a Cloudinary account.
2. Get your `CLOUDINARY_URL` (API Environment variable) from the dashboard.
3. Add it to `backend/.env`.
4. Ensure your folder settings in Cloudinary accept the uploaded document formats.
