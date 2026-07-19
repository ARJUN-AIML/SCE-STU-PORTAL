# API Documentation

Base URL: `http://localhost:8000` (Local) / `https://api.campusos.com` (Prod)

All protected routes require an `Authorization: Bearer <Firebase_ID_Token>` header.

## Health

### `GET /health`
* **Description**: Returns server status.
* **Auth Required**: No
* **Response**:
```json
{
  "status": "ready",
  "database": { "connected": true }
}
```

## Chatbot

### `POST /chat`
* **Description**: Sends a query to the RAG AI engine.
* **Auth Required**: Optional
* **Body**:
```json
{
  "question": "What time does the library open?"
}
```
* **Response**:
```json
{
  "response": "The library is open from 8:00 AM to 8:00 PM on weekdays."
}
```
* **Error (422)**: Missing `question` field.

## Authentication

### `POST /auth/verify`
* **Description**: Verifies a Firebase token and syncs the user to the local DB.
* **Auth Required**: Yes
* **Body**: Empty
* **Response**:
```json
{
  "uid": "12345",
  "email": "student@saranathan.ac.in",
  "role": "student"
}
```

## Events

### `GET /events`
* **Description**: Fetch all upcoming events.
* **Auth Required**: Yes

### `POST /events/register`
* **Description**: Register the current user for an event.
* **Auth Required**: Yes
* **Body**: `{ "event_id": 1 }`

## Clubs

### `POST /clubs/register`
* **Description**: Submit a new club registration request.
* **Auth Required**: Yes
* **Body**:
```json
{
  "student_name": "Arjun",
  "club_id": 2,
  "reason": "Interested in AI"
}
```
