import logging
from pathlib import Path
from langchain_chroma import Chroma
from langchain_community.retrievers import BM25Retriever
from langchain_core.documents import Document
from . import config
from .llm import get_embeddings

logger = logging.getLogger(__name__)


class CampusRetriever:
    """
    Production retriever that loads a pre-built ChromaDB index.

    It never generates embeddings or ingests data at runtime.
    The index is built offline via `scripts/build_vector_store.py`.
    """

    def __init__(self):
        self.embeddings = get_embeddings()
        self.chroma = None
        self.bm25 = None

        self._load_chroma()
        self._build_bm25_index()

    def _load_chroma(self):
        """Load a pre-built persistent ChromaDB. Never create or ingest."""
        chroma_path = config.CHROMA_DB_DIR

        if not Path(chroma_path).exists():
            logger.warning(
                f"ChromaDB directory not found at {chroma_path}. "
                "RAG is disabled. Run 'python scripts/build_vector_store.py' to build it."
            )
            return

        if not self.embeddings:
            logger.warning("Embeddings unavailable. Cannot load ChromaDB for similarity search.")
            # Load Chroma without an embedding function so BM25 can still work
            try:
                self.chroma = Chroma(persist_directory=str(chroma_path))
                count = self.chroma._collection.count() if self.chroma._collection else 0
                logger.info(f"Persistence path: {chroma_path} | Collection: {self.chroma._collection.name}")
                if count > 0:
                    logger.info(f"Loaded ChromaDB with {count} chunks (BM25-only mode, no dense search).")
                else:
                    logger.warning("ChromaDB collection is empty.")
                    self.chroma = None
            except Exception as e:
                logger.error(f"Failed to load ChromaDB in BM25-only mode: {e}")
                self.chroma = None
            return

        try:
            self.chroma = Chroma(
                persist_directory=str(chroma_path),
                embedding_function=self.embeddings,
            )
            count = self.chroma._collection.count() if self.chroma._collection else 0
            logger.info(f"Persistence path: {chroma_path} | Collection: {self.chroma._collection.name}")
            if count > 0:
                logger.info(f"Loaded pre-built ChromaDB with {count} chunks.")
            else:
                logger.warning("ChromaDB collection is empty. RAG will return no results.")
                self.chroma = None
        except Exception as e:
            logger.error(f"Failed to load ChromaDB: {e}")
            self.chroma = None

    def _build_bm25_index(self):
        """Build in-memory BM25 index from existing ChromaDB chunks."""
        if not self.chroma:
            logger.warning("Chroma is unavailable. Skipping BM25 index creation.")
            self.bm25 = None
            return

        try:
            data = self.chroma.get()
            docs = data.get("documents", [])
            metadatas = data.get("metadatas", [])

            if not docs:
                logger.warning("Chroma returned no documents. Skipping BM25 index creation.")
                self.bm25 = None
                return

            documents = []
            for i, text in enumerate(docs):
                documents.append(
                    Document(
                        page_content=text,
                        metadata=metadatas[i] if metadatas else {},
                    )
                )

            self.bm25 = BM25Retriever.from_documents(documents)
            logger.info(f"Built BM25 index over {len(documents)} chunks.")
        except Exception as e:
            logger.error(f"Failed to build BM25 index: {e}")
            self.bm25 = None

    def hybrid_search(self, query: str, k: int = 6, filter_dict: dict = None):
        """
        Hybrid Retrieval with Reciprocal Rank Fusion.

        Degrades gracefully:
          - Both unavailable -> []
          - Only BM25 -> keyword results
          - Only Dense -> vector results
          - Both available -> RRF fusion
        """
        if not self.chroma and not self.bm25:
            logger.warning("Both Chroma and BM25 are unavailable. Returning empty results.")
            return []

        # 0. Ensure embedding function is active
        if not self.embeddings:
            self.embeddings = get_embeddings()

        if self.chroma and self.embeddings:
            try:
                self.chroma._embedding_function = self.embeddings
            except Exception:
                pass

        # 1. Dense Search
        dense_results = []
        if self.chroma and self.embeddings:
            try:
                if filter_dict:
                    dense_results = self.chroma.similarity_search_with_score(
                        query, k=k * 2, filter=filter_dict
                    )
                else:
                    dense_results = self.chroma.similarity_search_with_score(query, k=k * 2)
            except Exception as e:
                logger.error(f"Dense search failed: {e}")

        dense_docs = [doc for doc, score in dense_results]

        # 2. Keyword Search
        bm25_docs = []
        if self.bm25:
            try:
                raw_bm25 = self.bm25.invoke(query)[: k * 3]
                if filter_dict:
                    for d in raw_bm25:
                        match = all(
                            d.metadata.get(k_f) == v_f for k_f, v_f in filter_dict.items()
                        )
                        if match:
                            bm25_docs.append(d)
                else:
                    bm25_docs = raw_bm25[: k * 2]
            except Exception as e:
                logger.error(f"BM25 search failed: {e}")

        # Single-source shortcuts (skip RRF when only one system is available)
        if not dense_results and bm25_docs:
            return [(doc, 0.0) for doc in bm25_docs[:k]]
        if dense_results and not bm25_docs:
            return dense_results[:k]
        if not dense_results and not bm25_docs:
            return []

        # 3. Reciprocal Rank Fusion (RRF)
        c = 60
        rrf_scores = {}
        doc_map = {}

        for rank, doc in enumerate(dense_docs):
            doc_id = doc.page_content
            doc_map[doc_id] = doc
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (rank + 1 + c)

        for rank, doc in enumerate(bm25_docs):
            doc_id = doc.page_content
            doc_map[doc_id] = doc
            rrf_scores[doc_id] = rrf_scores.get(doc_id, 0) + 1.0 / (rank + 1 + c)

        sorted_rrf = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)

        final_results = [(doc_map[doc_id], score) for doc_id, score in sorted_rrf[:k]]

        return final_results if final_results else dense_results[:k]


# ── Module-level singleton ───────────────────────────────────────────────

_instance = None


def init_vectorstore():
    """Load the pre-built vector store. Never rebuilds or ingests."""
    global _instance
    try:
        _instance = CampusRetriever()
    except Exception as e:
        logger.error(f"Failed to initialize CampusRetriever: {e}")
        _instance = None


def get_vectorstore() -> CampusRetriever | None:
    if _instance is None:
        logger.warning("Vectorstore not initialized. RAG features unavailable.")
    return _instance
