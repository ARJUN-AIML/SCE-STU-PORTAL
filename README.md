# SCE Student Portal

## Project Overview
SCE Student Portal is a unified digital ecosystem that redefines campus operations by bringing academics, administration, student services, campus resources, and communication onto a single platform. With an intuitive user experience and centralized access to essential services, it empowers the entire campus community through greater efficiency, accessibility, and collaboration.

## Key Features
- AI Assistant Chat Bot (RAG + Langchain + Emebeddings + Groq)
- Student Dashboard
- Event Management
- Clubs
- Transport
- Academics
- Placement Cell
- Notifications
- Administration
- Firebase Authentication
- Responsive UI

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- TanStack Query (React Query)
- Axios
- React Hook Form
- Zod
- Lucide React

### Backend
- FastAPI
- SQLAlchemy
- Alembic
- Pydantic
- Uvicorn
- Psycopg2

### AI & Machine Learning
- Groq (LLM Inference)
- LangChain
- ChromaDB (Vector Database)
- Google Gemini Embeddings
- Sentence Transformers
- RAG (Retrieval-Augmented Generation)

### Database
- Neon PostgreSQL(For Production)
- PostgreSQL(For Development)

### Authentication
- Firebase Authentication
- Firebase Admin SDK

### Cloud & Deployment
- Railway(Backend)
- Vercel(Frontend)
- Cloudinary
- Firebase

### APIs & Integrations
- Google Maps API
- Google Geocoding API

### Development Tools
- Git
- GitHub
- VS Code
- Postman

### Architecture
- REST API
- JWT Authentication
- Role-Based Access Control (RBAC)

## Project Architecture
```text
frontend/
backend/
docs/
Dataset_for_chatbot/
```

## Live Deployment

Frontend:
https://sce-stu-portal.vercel.app/

Backend:
https://protective-balance-production-5b44.up.railway.app

## Local Setup

### Prerequisites
- Node.js (v18 or higher)
- Python (3.10 or higher)
- Git

### Clone
```bash
git clone <repository-url>
cd <repository-directory>
```

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Frontend Setup
```bash
cd frontend
npm install
```

### Environment Variables
Configure the required environment variables in both the `frontend` and `backend` directories before running the application locally.

### Run Commands

Backend:
```bash
cd backend
uvicorn api:app --reload
```

Frontend:
```bash
cd frontend
npm run dev
```

## Environment Variables

### Backend
- DATABASE_URL
- GROQ_API_KEY
- GEMINI_API_KEY
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- GOOGLE_APPLICATION_CREDENTIALS
- BYPASS_AUTH

### Frontend
- VITE_FIREBASE_API_KEY
- VITE_FIREBASE_AUTH_DOMAIN
- VITE_FIREBASE_PROJECT_ID
- VITE_FIREBASE_STORAGE_BUCKET
- VITE_FIREBASE_MESSAGING_SENDER_ID
- VITE_FIREBASE_APP_ID
- VITE_API_BASE_URL
- VITE_BYPASS_AUTH

## API Documentation
The API documentation is automatically generated and available at the following endpoints when the backend is running:
- /docs
- /redoc

## Project Structure
- frontend/ - Contains the React application, UI components, and state management logic.
- backend/ - Contains the FastAPI server, database models, AI integration, and core business logic.
- docs/ - Technical documentation and setup guides.
- Dataset_for_chatbot/ - Datasets and scripts used for training and seeding the AI assistant.

## Deployment
- Frontend -> Vercel
- Backend -> Railway
- Database -> Neon PostgreSQL
- Authentication -> Firebase
- Media -> Cloudinary

## Updating AI Knowledge Base

The AI assistant uses a pre-built ChromaDB vector index that is committed to the repository. Railway loads this index at startup without downloading any models or generating embeddings.

To update the knowledge base after modifying datasets:

```bash
cd backend
python scripts/build_vector_store.py
```

Then commit and push the updated index:

```bash
git add backend/chroma_db/
git commit -m "Update vector store index"
git push
```

Railway will automatically load the updated index on the next deployment. No runtime indexing occurs in production.

## Project Team

**Arjun S** – Project Lead

**Madhav Padmesh S** ([@madhav-7575](https://github.com/madhav-7575)) – Co-Developer

## License
MIT
