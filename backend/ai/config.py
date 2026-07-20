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
    raise ValueError("GROQ_API_KEY environment variable is not set")
EMBEDDING_MODEL_NAME = "BAAI/bge-small-en-v1.5"
LLM_MODEL_NAME = "llama-3.3-70b-versatile"
