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
