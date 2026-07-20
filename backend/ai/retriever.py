import logging
from langchain_chroma import Chroma
from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document
from . import config
from .llm import get_embeddings
from .ingest import ingest_data

logger = logging.getLogger(__name__)

class CampusRetriever:
    def __init__(self, force_rebuild=False):
        self.embeddings = get_embeddings()
        self.chroma = None
        self.bm25 = None
        
        self._initialize_chroma(force_rebuild)
        self.build_bm25_index()

    def _initialize_chroma(self, force_rebuild):
        if not self.embeddings:
            logger.warning("Embeddings are missing, skipping Chroma initialization.")
            self.chroma = None
            return

        if force_rebuild:
            logger.info("Force rebuild requested. Starting ingestion...")
            self.chroma = Chroma(
                persist_directory=str(config.CHROMA_DB_DIR),
                embedding_function=self.embeddings
            )
            self.chroma = ingest_data(self.chroma)
            return

        logger.info("Connecting to existing ChromaDB...")
        self.chroma = Chroma(
            persist_directory=str(config.CHROMA_DB_DIR),
            embedding_function=self.embeddings
        )
        
        try:
            existing_count = len(self.chroma.get()["ids"])
        except Exception:
            existing_count = 0
            
        if existing_count == 0:
            logger.info("ChromaDB is empty. Starting one-time ingestion...")
            self.chroma = ingest_data(self.chroma)
        else:
            logger.info(f"Loaded existing ChromaDB with {existing_count} chunks.")

    def build_bm25_index(self):
        """Builds in-memory BM25 index from ChromaDB chunks for hybrid retrieval."""
        try:
            data = self.chroma.get()
            docs = data.get("documents", [])
            metadatas = data.get("metadatas", [])
            
            if not docs:
                self.bm25 = None
                return
                
            documents = []
            for i, text in enumerate(docs):
                documents.append(Document(page_content=text, metadata=metadatas[i] if metadatas else {}))
                
            self.bm25 = BM25Retriever.from_documents(documents)
            logger.info(f"Built BM25 index over {len(documents)} chunks.")
        except Exception as e:
            logger.error(f"Failed to build BM25 index: {e}")
            self.bm25 = None

    def hybrid_search(self, query: str, k: int = 6, filter_dict: dict = None):
        """Executes Hybrid Retrieval (Dense + BM25) and scores via Reciprocal Rank Fusion."""
        
        if not self.chroma:
            logger.warning("Chroma is not initialized, hybrid search unavailable.")
            return []
            
        # 1. Dense Search
        if filter_dict:
            dense_results = self.chroma.similarity_search_with_score(query, k=k*2, filter=filter_dict)
        else:
            dense_results = self.chroma.similarity_search_with_score(query, k=k*2)
            
        dense_docs = [doc for doc, score in dense_results]
        
        # 2. Keyword Search
        bm25_docs = []
        if self.bm25:
            # BM25 doesn't natively support metadata pre-filtering easily in the Langchain wrapper without hacking,
            # so we retrieve more and post-filter.
            raw_bm25 = self.bm25.invoke(query)[:k*3]
            if filter_dict:
                for d in raw_bm25:
                    match = True
                    for k_f, v_f in filter_dict.items():
                        if d.metadata.get(k_f) != v_f:
                            match = False
                            break
                    if match:
                        bm25_docs.append(d)
            else:
                bm25_docs = raw_bm25[:k*2]

        # 3. Reciprocal Rank Fusion (RRF)
        c = 60 # RRF constant
        
        rrf_scores = {}
        doc_map = {}
        
        # Rank Dense
        for rank, doc in enumerate(dense_docs):
            doc_id = doc.page_content # using content as naive ID
            doc_map[doc_id] = doc
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (rank + 1 + c)
            
        # Rank BM25
        for rank, doc in enumerate(bm25_docs):
            doc_id = doc.page_content
            doc_map[doc_id] = doc
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (rank + 1 + c)
            
        # Sort and return top K
        sorted_rrf = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)
        
        final_results = []
        for doc_id, score in sorted_rrf[:k]:
            final_results.append((doc_map[doc_id], score))
            
        # If RRF is empty (fallback to dense)
        if not final_results:
            return dense_results[:k]
            
        return final_results

_instance = None

def init_vectorstore(force_rebuild=False):
    global _instance
    _instance = CampusRetriever(force_rebuild=force_rebuild)

def get_vectorstore() -> CampusRetriever:
    if _instance is None:
        raise RuntimeError("Vectorstore not initialized! Call init_vectorstore() first.")
    return _instance
