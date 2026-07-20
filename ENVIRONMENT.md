# Environment Variables Reference

## Frontend (`frontend/.env`)
| Variable | Required | Purpose | Example |
|---|---|---|---|
| `VITE_API_URL` | Yes | Base URL for the FastAPI backend | `https://protective-balance-production-5b44.up.railway.app` |
| `VITE_FIREBASE_API_KEY` | Yes | Firebase Web SDK API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Yes | Firebase Auth Domain | `sce-portal-auth.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Yes | Firebase Project ID | `sce-portal-1234` |
| `VITE_FIREBASE_APP_ID` | Yes | Firebase Web App ID | `1:12345:web:abcde` |

## Backend (`backend/.env`)
| Variable | Required | Purpose | Example |
|---|---|---|---|
| `DATABASE_URL` | Yes | Connection string to PostgreSQL | `postgresql+psycopg://user:pass@ep-pool.aws.neon.tech/neondb` |
| `GROQ_API_KEY` | Yes | Key for Groq LLM API | `gsk_123456789...` |
| `FIREBASE_CREDENTIALS_JSON` | Yes | Stringified JSON of the Firebase Admin service account | `{"type": "service_account", ...}` |
| `CLOUDINARY_URL` | No | URL for Cloudinary image uploads | `cloudinary://key:secret@cloud_name` |
| `CORS_ORIGINS` | No | Comma-separated list of allowed origins | `https://sce-stu-portal.vercel.app,https://sce-stu-portal.vercel.app` |
