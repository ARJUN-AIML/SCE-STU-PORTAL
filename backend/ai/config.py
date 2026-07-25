import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Resolve absolute paths
current_file_path = Path(__file__).resolve()
BASE_DIR = current_file_path.parent.parent

def _find_dataset_dir():
    backend_dir = current_file_path.parent.parent
    root_dir = backend_dir.parent
    
    candidate_1 = root_dir / "Dataset_for_chatbot"
    if candidate_1.exists():
        return candidate_1
    candidate_2 = backend_dir / "Dataset_for_chatbot"
    if candidate_2.exists():
        return candidate_2
    candidate_3 = backend_dir / "data"
    if candidate_3.exists():
        return candidate_3
    return candidate_1

DATA_DIR = _find_dataset_dir()

# ChromaDB directory
CHROMA_DB_DIR = current_file_path.parent.parent / "chroma_db"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    import logging as _logging
    _logging.getLogger(__name__).warning("GROQ_API_KEY is not set. LLM features will be unavailable.")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL_NAME = "models/gemini-embedding-2"
LLM_MODEL_NAME = "llama-3.3-70b-versatile"
