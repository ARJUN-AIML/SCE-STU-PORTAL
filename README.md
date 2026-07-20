# SCE Student Portal

## Project Overview
The SCE Student Portal is an AI-powered centralized campus management platform. It streamlines academic workflows and administrative processes by providing students, faculty, and administrators with a unified interface for managing campus activities, resources, and communication.

## Key Features
- AI Assistant (RAG + Groq)
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

### Backend
- FastAPI
- SQLAlchemy
- Alembic

### AI
- Groq
- LangChain
- ChromaDB
- Sentence Transformers

### Database
- Neon PostgreSQL

### Cloud
- Railway
- Vercel
- Firebase
- Cloudinary

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

## Contributors
Contributions are welcome. Please ensure pull requests follow the existing coding standards and include appropriate documentation updates.

## License
MIT
