# System Architecture

This document describes the architectural layout of SCE Student Portal.

## Frontend → Backend Communication

```mermaid
sequenceDiagram
    participant User
    participant React UI (Vite)
    participant FastAPI
    participant PostgreSQL
    
    User->>React UI (Vite): Interact with App
    React UI (Vite)->>FastAPI: HTTP Request (JWT Bearer)
    FastAPI->>FastAPI: Validate Firebase JWT
    FastAPI->>PostgreSQL: Query Data (SQLAlchemy)
    PostgreSQL-->>FastAPI: Return Data
    FastAPI-->>React UI (Vite): HTTP Response (JSON)
    React UI (Vite)-->>User: Update UI State
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Firebase
    participant Backend
    
    User->>Frontend: Submit Email/Password
    Frontend->>Firebase: signInWithEmailAndPassword()
    Firebase-->>Frontend: Return ID Token (JWT)
    Frontend->>Backend: API Request + Auth Header (Bearer <Token>)
    Backend->>Firebase: Verify Token (Admin SDK)
    Firebase-->>Backend: Return Decoded User UID
    Backend-->>Frontend: 200 OK + Data
```

## AI Chatbot & RAG Pipeline

```mermaid
graph TD
    A[User Query] --> B[FastAPI Chat Endpoint]
    B --> C{Context Required?}
    C -- Yes --> D[ChromaDB Vector Search]
    D --> E[Retrieve Campus Docs]
    E --> F[Inject Context into Prompt]
    F --> G[Groq / Gemini LLM]
    C -- No --> G
    G --> H[Return Response to User]
```

## Database Architecture

```mermaid
erDiagram
    USERS {
        string uid PK
        string email
        string role
        string full_name
    }
    CLUBS {
        int id PK
        string name
        string description
    }
    EVENTS {
        int id PK
        string title
        datetime date
    }
    
    USERS ||--o{ EVENTS : "registers"
    USERS ||--o{ CLUBS : "joins"
```

## Deployment Architecture

```mermaid
graph LR
    A[User Browser] -->|HTTPS| B[Vercel CDN Edge]
    B -->|React App| C[FastAPI Server - Render]
    C -->|psycopg| D[(Neon PostgreSQL)]
    C -->|API Calls| E[Firebase Auth Service]
    C -->|API Calls| F[Groq LLM Service]
```
