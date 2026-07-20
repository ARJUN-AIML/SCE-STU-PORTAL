import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

# Resolve absolute paths
current_file_path = Path(__file__).resolve()

# PROJECT_ROOT is e:/SCE Student Portal (3 levels up from config.py)
PROJECT_ROOT = current_file_path.parent.parent.parent

# Dataset directory
DATA_DIR = PROJECT_ROOT / "Dataset_for_chatbot"

# ChromaDB directory
CHROMA_DB_DIR = current_file_path.parent.parent / "chroma_db"

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY environment variable is not set")
EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"
LLM_MODEL_NAME = "llama-3.3-70b-versatile"
