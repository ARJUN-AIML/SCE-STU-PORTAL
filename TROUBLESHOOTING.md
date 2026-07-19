# Troubleshooting Guide

## 1. Firebase Configuration Errors
**Symptom**: "Firebase: No Firebase App '[DEFAULT]' has been created" or Login modal hangs.
**Fix**: Ensure `VITE_FIREBASE_API_KEY` and all related variables are correctly populated in `frontend/.env`.

## 2. Neon Connection Failures
**Symptom**: Backend startup logs show `sqlalchemy.exc.OperationalError: FATAL: password authentication failed`.
**Fix**: Verify your `DATABASE_URL` in `backend/.env`. Ensure you are using `postgresql+psycopg://` and not just `postgres://`.

## 3. CORS Problems
**Symptom**: Browser console shows `CORS policy: No 'Access-Control-Allow-Origin' header is present`.
**Fix**: Add your frontend URL (e.g., `http://localhost:5173` or `https://app.vercel.app`) to the FastAPI `CORSMiddleware` config in `api.py`.

## 4. AI Model Connection Issues
**Symptom**: Chatbot returns `500 Internal Server Error` or times out.
**Fix**: Check your `GROQ_API_KEY`. If rate limited, check the Groq console. Ensure ChromaDB has ingested documents (`admin-knowledge` rebuild in UI).

## 5. Build Failures (Vite Chunk Size)
**Symptom**: Vite warns about chunks larger than 1000kB.
**Fix**: This is a warning, not a hard error. To resolve, further lazy-load libraries like `lucide-react` or `framer-motion` inside `vite.config.ts`.
