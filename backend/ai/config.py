import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Resolve absolute paths
current_file_path = Path(__file__).resolve()

# Resolve dataset directory dynamically to support both local and Railway deployments
def _find_dataset_dir():
    if Path("../Dataset_for_chatbot").exists():
        return Path("../Dataset_for_chatbot").resolve()
    if Path("Dataset_for_chatbot").exists():
        return Path("Dataset_for_chatbot").resolve()
    return Path("../Dataset_for_chatbot")

DATA_DIR = _find_dataset_dir()

# ChromaDB directory
CHROMA_DB_DIR = current_file_path.parent.parent / "chroma_db"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    import logging as _logging
    _logging.getLogger(__name__).warning("GROQ_API_KEY is not set. LLM features will be unavailable.")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
EMBEDDING_MODEL_NAME = "models/text-embedding-004"
LLM_MODEL_NAME = "llama-3.3-70b-versatile"
