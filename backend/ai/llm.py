import logging

from langchain_groq import ChatGroq
from . import config

logger = logging.getLogger(__name__)

_embeddings_instance = None
_llm_instance = None

from langchain_google_genai import GoogleGenerativeAIEmbeddings

def get_embeddings():
    global _embeddings_instance
    if _embeddings_instance is not None:
        return _embeddings_instance

    # 1. Try local HuggingFace model if available (0ms latency, zero API rate limit)
    try:
        import os
        from langchain_huggingface import HuggingFaceEmbeddings
        local_model_path = os.path.join(config.BASE_DIR, "models", "bge-small-en-v1.5")
        if os.path.exists(local_model_path):
            _embeddings_instance = HuggingFaceEmbeddings(
                model_name=local_model_path,
                model_kwargs={'device': 'cpu'},
                encode_kwargs={'normalize_embeddings': True}
            )
            logger.info("Successfully initialized local HuggingFace embeddings (bge-small-en-v1.5).")
            return _embeddings_instance
    except Exception as e:
        logger.warning(f"Local HuggingFace embeddings load attempt skipped: {e}")

    # 2. Fallback to Gemini API Embeddings
    if not config.GEMINI_API_KEY:
        logger.warning("GEMINI_API_KEY is not set. Embeddings unavailable.")
        return None
        
    try:
        _embeddings_instance = GoogleGenerativeAIEmbeddings(
            model=config.EMBEDDING_MODEL_NAME,
            google_api_key=config.GEMINI_API_KEY
        )
    except Exception as e:
        logger.error(f"Failed to load embedding API client: {e}")
        _embeddings_instance = None
        
    return _embeddings_instance

def init_llm():
    global _llm_instance
    if not config.GROQ_API_KEY:
        logger.warning("GROQ_API_KEY is not set in the environment.")
    
    logger.info("Initializing LLM (Singleton)...")
    _llm_instance = ChatGroq(
        model_name=config.LLM_MODEL_NAME,
        api_key=config.GROQ_API_KEY,
        temperature=0
    )

def get_llm():
    global _llm_instance
    if _llm_instance is None:
        init_llm()
    return _llm_instance
