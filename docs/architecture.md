# SCE Campus Fresher Portal - Architecture Overview

## Project Structure
```text
CampusOS/
├── frontend/ (React, Vite, Tailwind, TanStack Query)
│   ├── src/
│   │   ├── components/  # UI components (schedule-card, ai-assistant-card, topbar, sidebar)
│   │   ├── context/     # React Contexts (auth-context, app-settings)
│   │   ├── lib/         # API wrappers (api.ts, firebase.ts)
│   │   ├── types/       # TypeScript Definitions
│   │   └── App.tsx & main.tsx
│   └── package.json
├── backend/ (FastAPI, SQLAlchemy, WebSockets)
│   ├── ai/              # RAG Pipeline (assistant.py, retriever.py, ingest.py)
│   ├── auth/            # Firebase verification (firebase.py)
│   ├── database/        # Config and SQLAlchemy setup (config.py)
│   ├── models/          # Database schemas (models.py)
│   ├── routers/         # API endpoints (data.py, registration.py, upload.py)
│   ├── schemas/         # Pydantic schemas (schemas.py)
│   ├── services/        # CSV loading logic (csv_loader.py)
│   ├── websocket/       # WebSocket streaming logic (socket.py)
│   └── api.py           # Main FastAPI application
└── docs/                # Project documentation
```

## Database Schema (models.py)
- **User**: Stores authenticated user profiles (`firebase_uid`, `email`, `name`).
- **Registration**: Tracks user signups to events and clubs (`user_id`, `event_id`, `type`, `status`).
- **UploadedFile**: Metadata for Cloudinary uploads (`filename`, `url`, `indexed`).
- **ChatHistory**: Stores conversation logs (`session_id`, `role`, `content`).

## Modified & Created Files
- **Created**: `backend/models/models.py`, `backend/routers/*.py`, `backend/services/csv_loader.py`, `backend/websocket/socket.py`, `frontend/src/lib/api.ts`, `frontend/src/context/auth-context.tsx`, `frontend/src/components/login.tsx`, `docs/*.md`.
- **Modified**: `frontend/src/App.tsx`, `frontend/src/main.tsx`, `frontend/src/components/*.tsx`, `backend/api.py`.
- **Deleted**: `frontend/src/data/mock.ts`.
