# CampusOS

![CampusOS Hero](https://via.placeholder.com/1200x400?text=CampusOS+-+The+Intelligent+Campus+Portal)

CampusOS is a next-generation intelligent campus portal designed for Saranathan College of Engineering. It seamlessly integrates a beautiful React-based frontend with a powerful AI-driven FastAPI backend.

## 🚀 Key Features

* **Intelligent AI Assistant**: RAG-powered chatbot utilizing Groq and ChromaDB to answer campus-specific questions.
* **Smart Dashboards**: Real-time insights, analytics, and notices for students and faculty.
* **Campus Navigation**: Interactive indoor and outdoor routing maps.
* **Academic Hub**: Timetables, Library Resources, and Department Directories.
* **Transport Tracker**: Live tracking and routing of college buses.
* **Role-Based Access**: Specialized interfaces for Students, Faculty, and Administrators.

## 🛠️ Tech Stack

### Frontend
* **Framework**: React 19 + Vite
* **Styling**: Tailwind CSS + Radix UI
* **State/Routing**: React Query, Zustand, React Router
* **Testing**: Vitest + Playwright

### Backend
* **Framework**: FastAPI (Python)
* **Database**: PostgreSQL (Neon) with SQLite Fallback
* **ORM**: SQLAlchemy + Alembic
* **AI/LLM**: LangChain, Groq API, HuggingFace Embeddings, ChromaDB
* **Testing**: Pytest

## 📁 Folder Structure

```
CampusOS/
├── frontend/             # React Vite Application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── features/     # Feature-based modules (Dashboard, Auth, etc.)
│   │   ├── lib/          # Utilities and API clients
│   │   └── context/      # React contexts (Auth, Theme)
│   └── e2e/              # Playwright Tests
│
├── backend/              # FastAPI Application
│   ├── routers/          # API Route handlers
│   ├── services/         # Business logic & AI pipelines
│   ├── database/         # Models and connection logic
│   └── tests/            # Pytest suites
```

## 💻 Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/CampusOS.git
   cd CampusOS
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: .\venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn api:app --reload
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## ⚙️ Environment Variables Reference
See [ENVIRONMENT.md](./ENVIRONMENT.md) for a detailed list of required environment variables.

## 🏗️ Build Instructions
```bash
# Frontend
cd frontend
npm run build

# Backend (Docker - optional)
cd backend
docker build -t campusos-backend .
```

## 🌍 Deployment Links
* **Frontend**: [https://campusos-staging.vercel.app](https://campusos-staging.vercel.app) *(Placeholder)*
* **Backend**: [https://api.campusos.render.com](https://api.campusos.render.com) *(Placeholder)*

## 🗺️ Future Roadmap
* Native iOS/Android app wrappers (React Native).
* Automated push notifications.
* Live bus GPS integration.

## 📄 License
This project is licensed under the MIT License.
