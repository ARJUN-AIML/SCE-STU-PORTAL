import logging
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_groq import ChatGroq
from . import config

logger = logging.getLogger(__name__)

_embeddings_instance = None
_llm_instance = None

def init_embeddings():
    global _embeddings_instance
    logger.info("Initializing Embeddings (Singleton)...")
    _embeddings_instance = HuggingFaceEmbeddings(
        model_name=config.EMBEDDING_MODEL_NAME,
        model_kwargs={"local_files_only": True}
    )

def get_embeddings():
    if _embeddings_instance is None:
        raise RuntimeError("Embeddings not initialized! Call init_embeddings() first.")
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
    if _llm_instance is None:
        raise RuntimeError("LLM not initialized! Call init_llm() first.")
    return _llm_instance
