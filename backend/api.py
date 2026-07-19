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

# FORCE HUGGINGFACE OFFLINE MODE to skip network checks during startup
os.environ["HF_HUB_OFFLINE"] = "1"
os.environ["TRANSFORMERS_OFFLINE"] = "1"
from ai.profiler import StartupProfiler
from ai.assistant import CollegeAIAssistant
from ai.llm import init_embeddings, get_embeddings, init_llm
from ai.retriever import init_vectorstore, get_vectorstore
from services.csv_loader import csv_db
from database.config import engine, Base

# Import routers
from routers import data
from routers import registration
from routers import upload
from websocket import socket

# Create DB tables
Base.metadata.create_all(bind=engine)

import os

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _backend_state, _health_stats
    _backend_state = "STARTING"
    _health_stats = {"startup_duration_ms": 0}

    async def run_startup():
        global _backend_state
        profiler = StartupProfiler()
        t0 = time.time()
        
        if not os.getenv("DATABASE_URL") or not os.getenv("GROQ_API_KEY"):
            logger.error("Missing critical environment variables (DATABASE_URL or GROQ_API_KEY)")
            _backend_state = "FAILED"
            return
            
        try:
            # Run heavy independent loads concurrently
            await asyncio.gather(
                asyncio.to_thread(init_embeddings),
                asyncio.to_thread(init_llm),
                asyncio.to_thread(csv_db.load_all)
            )
            # Chroma depends on embeddings
            await asyncio.to_thread(init_vectorstore)
            
            # Warm-up AI Models
            embeddings = get_embeddings()
            vectorstore = get_vectorstore()
            await asyncio.to_thread(embeddings.embed_query, "warmup")
            await asyncio.to_thread(vectorstore.hybrid_search, "warmup", k=1)
            
            _health_stats["startup_duration_ms"] = int((time.time() - t0) * 1000)
            
            try:
                if vectorstore.chroma:
                    data = vectorstore.chroma.get()
                    _health_stats["chunks"] = len(data.get("ids", []))
                    metas = data.get("metadatas", [])
                    _health_stats["documents"] = len(set(m.get("source_file") for m in metas if m and "source_file" in m))
            except Exception as e:
                logger.error(f"Failed to load Chroma stats: {e}")

            _backend_state = "READY"
            profiler.print_report()
            logger.info("AI Subsystems Ready in background.")
            
        except Exception as e:
            logger.error(f"Startup Failed: {e}")
            global _backend_error
            _backend_error = str(e)
            _backend_state = "FAILED"

    # Start the heavy initialization in the background
    asyncio.create_task(run_startup())
    
    # Yield immediately so the web server can bind the port and serve regular HTTP requests instantly!
    yield

_backend_state = "STARTING"
_health_stats = {}
app = FastAPI(title="SCE Campus AI Assistant API", lifespan=lifespan)

# Initialize the assistant globally so it's shared across requests
assistant = CollegeAIAssistant()

# Allow CORS for local frontend testing
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
        "*"
    ],
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

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str
    sources: list[str]
    metadata: list[dict[str, Any]]

@app.get("/health")
async def health_endpoint():
    return {
        "status": _backend_state.lower(),
        "error": globals().get("_backend_error", None),
        "startup_duration_ms": _health_stats.get("startup_duration_ms", 0),
        "database": {
            "connected": _backend_state == "READY",
            "pool_size": 10
        },
        "rag": {
            "collection": _health_stats.get("collection", "sce-campus"),
            "documents": _health_stats.get("documents", 0),
            "chunks": _health_stats.get("chunks", 0),
            "embedding_model": "BAAI/bge-small-en-v1.5"
        },
        "llm": {
            "provider": "Groq",
            "ready": _backend_state == "READY"
        },
        "websocket": {
            "ready": _backend_state == "READY"
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
        response_data = assistant.ask(request.question)
        return ChatResponse(
            answer=response_data["answer"],
            sources=response_data["sources"],
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("api:app", host="0.0.0.0", port=8000, reload=True)
