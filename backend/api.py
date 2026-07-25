from fastapi import FastAPI, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from pydantic import BaseModel
from typing import Any
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

import time
import asyncio
import os

# FORCE HUGGINGFACE OFFLINE MODE — production must never download models
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"

from ai.profiler import StartupProfiler
from ai.assistant import CollegeAIAssistant
from ai.llm import get_embeddings, init_llm
from ai.retriever import init_vectorstore, get_vectorstore

from database.config import engine, Base

# Import routers
from routers import data
from routers import registration
from routers import upload
from websocket import socket

# Create DB tables
Base.metadata.create_all(bind=engine)


# ── Health state ─────────────────────────────────────────────────────────

_backend_state = "STARTING"
_ai_state = {
    "embeddings": False,
    "chroma": False,
    "bm25": False,
    "faq": False,
}
_health_stats = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _backend_state, _ai_state, _health_stats
    _backend_state = "STARTING"
    _health_stats = {"startup_duration_ms": 0}

    async def run_startup():
        global _backend_state
        profiler = StartupProfiler()
        t0 = time.time()

        if not os.getenv("DATABASE_URL"):
            logger.error("Missing critical environment variable: DATABASE_URL")
            _backend_state = "FAILED"
            return

        try:
            # ── Core: LLM (independent, can run in parallel) ────
            await asyncio.gather(
                asyncio.to_thread(init_llm)
            )

            # ── Load pre-built ChromaDB (no ingestion, no embedding gen) ──
            await asyncio.to_thread(init_vectorstore)

            # ── Record AI component states ────────────────────────────
            embeddings = get_embeddings()
            vectorstore = get_vectorstore()

            if embeddings is not None:
                _ai_state["embeddings"] = True

            if vectorstore is not None:
                if vectorstore.chroma is not None:
                    _ai_state["chroma"] = True
                if vectorstore.bm25 is not None:
                    _ai_state["bm25"] = True

            # ── FAQ Engine ────────────────────────────────────────────
            try:
                from ai.faq_engine import FAQEngine
                faq = FAQEngine.get_instance()
                if faq.example_embeddings is not None:
                    _ai_state["faq"] = True
            except Exception as e:
                logger.warning(f"FAQ Engine failed to initialize: {e}")

            _health_stats["startup_duration_ms"] = int((time.time() - t0) * 1000)

            # ── Collect Chroma stats ──────────────────────────────────
            try:
                if vectorstore and vectorstore.chroma and vectorstore.chroma._collection:
                    _health_stats["chunks"] = vectorstore.chroma._collection.count()
                    # We can't easily get unique source_files without reading everything, so we estimate
                    _health_stats["documents"] = _health_stats["chunks"] // 10
            except Exception as e:
                logger.error(f"Failed to load Chroma stats: {e}")

            # ── Final state ───────────────────────────────────────────
            if all(_ai_state.values()):
                _backend_state = "READY"
            else:
                _backend_state = "DEGRADED"

            profiler.print_report()
            logger.info(f"Startup complete. State: {_backend_state} | AI: {_ai_state}")

        except Exception as e:
            logger.error(f"Core Startup Failed: {e}")
            global _backend_error
            _backend_error = str(e)
            _backend_state = "FAILED"

    # Start background init — the web server binds the port immediately
    asyncio.create_task(run_startup())
    yield


app = FastAPI(title="SCE Campus AI Assistant API", lifespan=lifespan)

# Initialize the assistant globally so it's shared across requests
assistant = CollegeAIAssistant()

# Add ProxyHeadersMiddleware for reverse proxy header forwarding on Railway
from uvicorn.middleware.proxy_headers import ProxyHeadersMiddleware
app.add_middleware(ProxyHeadersMiddleware, trusted_hosts=["*"])

# Allow CORS for configured origins & production Vercel frontend
raw_cors = os.getenv("CORS_ORIGINS", "")
allowed_origins = [origin.strip() for origin in raw_cors.split(",") if origin.strip()]
default_origins = [
    "https://sce-stu-portal.vercel.app",
    "https://protective-balance-production-5b44.up.railway.app",
    "http://localhost:5173",
    "http://localhost:3000",
]
for default_origin in default_origins:
    if default_origin not in allowed_origins:
        allowed_origins.append(default_origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if "*" not in allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(data.router)
app.include_router(registration.router)
app.include_router(upload.router)
app.include_router(socket.router)
from routers import admin_ai, admin_cms, auth, clubs
app.include_router(admin_ai.router)
app.include_router(admin_cms.router)
app.include_router(auth.router)
app.include_router(clubs.router)


# ── Models ───────────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    metadata: list[dict[str, Any]]


# ── Endpoints ────────────────────────────────────────────────────────────

@app.get("/health")
async def health_endpoint():
    db_connected = False
    try:
        from sqlalchemy import text
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_connected = True
    except Exception as e:
        logger.warning(f"Database health check failed: {e}")

    return {
        "status": "ready" if (db_connected and _backend_state in ["READY", "DEGRADED"]) else (_backend_state.lower()),
        "error": globals().get("_backend_error", None),
        "startup_duration_ms": _health_stats.get("startup_duration_ms", 0),
        "database": {
            "connected": db_connected,
            "pool_size": 5
        },
        "ai": _ai_state,
        "rag": {
            "collection": _health_stats.get("collection", "sce-campus"),
            "documents": _health_stats.get("documents", 0),
            "chunks": _health_stats.get("chunks", 0),
            "embedding_model": "BAAI/bge-small-en-v1.5"
        },
        "llm": {
            "provider": "Groq",
            "ready": _backend_state in ["READY", "DEGRADED"]
        },
        "websocket": {
            "ready": _backend_state in ["READY", "DEGRADED"]
        }
    }

@app.get("/metrics")
async def metrics_endpoint():
    return {
        "request_count": 0,
        "average_retrieval_latency_ms": 0,
        "average_llm_generation_latency_ms": 0,
        "active_websocket_connections": len(socket.manager.active_connections) if hasattr(socket, 'manager') else 0,
        "chroma_query_count": 0,
        "uptime_seconds": 0
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        response_data = await assistant.ask_async(request.question)
        return ChatResponse(
            answer=response_data.get("answer", ""),
            sources=response_data.get("sources", []),
            metadata=response_data.get("metadata", [])
        )
    except Exception as e:
        logger.error(f"Error processing chat: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/rebuild")
async def rebuild_endpoint(background_tasks: BackgroundTasks):
    try:
        # Run rebuilding in the background so we don't block the API
        background_tasks.add_task(assistant.rebuild)
        return {"message": "Rebuilding database in the background."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/seed-production-db")
async def seed_production_db():
    import subprocess
    try:
        # Run the unified seed script
        result = subprocess.run(
            ["python", "scripts/seed_production.py"], 
            capture_output=True, text=True
        )
        if result.returncode == 0:
            return {"success": True, "message": "Database seeded successfully!", "logs": result.stdout}
        else:
            return {"success": False, "message": "Seeding failed", "logs": result.stderr}
    except Exception as e:
        return {"success": False, "message": str(e)}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("api:app", host="0.0.0.0", port=port, reload=False)

