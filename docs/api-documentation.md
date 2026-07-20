# API Documentation

## Base URL
`https://protective-balance-production-5b44.up.railway.app` (Local) / `{RENDER_URL}` (Production)

## Authentication
All protected routes require a Firebase JWT Token passed in the `Authorization` header:
`Authorization: Bearer <FIREBASE_ID_TOKEN>`

## Endpoints

### Data Endpoints (GET)
- `/events`: Returns all campus events parsed from CSV.
- `/clubs`: Returns all clubs and societies.
- `/faculty`: Returns faculty directory.
- `/schedule`: Returns current timetable/notices.
- `/notices`: Returns latest announcements.
- `/resources`: Returns all user-uploaded resources metadata.
- `/search?query=<string>`: Searches across events, clubs, and faculty.
- `/map/location/{room}`: Finds coordinates and details for a specific room.

### Registration (POST)
- `/register`
  - **Body**: `{ "event_id": "string", "type": "event|club" }`
  - **Auth Required**: Yes
  - **Description**: Registers the current authenticated user for an event or club.

### Uploads (POST)
- `/upload`
  - **Body**: `multipart/form-data` with `file`
  - **Auth Required**: Yes
  - **Description**: Uploads to Cloudinary, saves metadata to Neon Postgres, and asynchronously triggers `ingest.py` to index the file into ChromaDB.

### AI Assistant (POST)
- `/chat`
  - **Body**: `{ "question": "string" }`
  - **Description**: Standard REST endpoint for querying the RAG pipeline.

### WebSockets (WS)
- `/ws/chat`
  - **Description**: Send `{ "question": "string" }` to stream responses token-by-token. Emits `{ "type": "stream", "content": "..." }` and `{ "type": "done", "sources": [...] }`.
