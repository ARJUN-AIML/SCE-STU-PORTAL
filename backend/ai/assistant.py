import shutil
import logging
import time
from langchain_core.messages import HumanMessage, AIMessage
from . import config
from .llm import get_llm
from .prompts import RAG_PROMPT, CONTEXTUALIZE_Q_PROMPT

logger = logging.getLogger(__name__)

class SimpleCache:
    def __init__(self, ttl_seconds):
        self.cache = {}
        self.ttl = ttl_seconds
        
    def get(self, key):
        if key in self.cache:
            value, expiry = self.cache[key]
            if time.time() < expiry:
                return value
            else:
                del self.cache[key]
        return None
        
    def set(self, key, value):
        self.cache[key] = (value, time.time() + self.ttl)
        
    def invalidate(self):
        self.cache = {}

query_cache = SimpleCache(ttl_seconds=300)

class CollegeAIAssistant:
    """
    Independent RAG-based AI Assistant module for College Knowledge Base.
    """
    def __init__(self, force_rebuild=False):
        if force_rebuild:
            from .retriever import init_vectorstore
            init_vectorstore(force_rebuild=True)
        self.chat_history = []
        self.max_memory = 5  # Maintain last 5 user/assistant exchanges
        
    @property
    def vectorstore(self):
        from .retriever import get_vectorstore
        return get_vectorstore()

    def rebuild(self):
        """Clears the existing ChromaDB and recreates it from datasets."""
        logger.info("Rebuilding vector database...")
        if config.CHROMA_DB_DIR.exists():
            shutil.rmtree(config.CHROMA_DB_DIR)
            logger.info(f"Deleted existing ChromaDB at {config.CHROMA_DB_DIR}")
        
        self.chat_history = []
        query_cache.invalidate()
        from .retriever import init_vectorstore
        init_vectorstore(force_rebuild=True)
        
        # Sync faculty
        from database.config import SessionLocal
        from ai.faculty_sync import sync_all_faculty_to_chroma
        from ai.transport_sync import sync_all_transport_to_chroma
        db = SessionLocal()
        try:
            sync_all_faculty_to_chroma(db, self.vectorstore)
            sync_all_transport_to_chroma()
        except Exception as e:
            logger.error(f"Error during Postgres sync: {e}")
        finally:
            db.close()
            
        logger.info("Rebuild complete.")

    async def _detect_intent(self, query: str, llm):
        """Lightweight Query Router for intent detection and metadata pre-filtering."""
        INTENT_PROMPT = f"""
Classify the intent of this query to help route it to the correct dataset.
Categories:
- Faculty (Any questions about professors, HODs, designations)
- Timetable (Schedule, classes)
- Events (Hackathons, symposiums)
- Notices (Placements, general notices)
- Transport (Buses, routes)
- General (Campus information, library, facilities)

Query: {query}
Respond ONLY with the category name.
"""
        intent_response = await llm.ainvoke([HumanMessage(content=INTENT_PROMPT)])
        intent_str = intent_response.content.strip().lower()
        
        filter_dict = {}
        # Pre-filter dataset depending on intent.
        # This matches the 'category' metadata added by some ingestions or infers logic.
        if "faculty" in intent_str:
            # We can optionally inject a keyword filter if they ask about a specific department
            pass # In a full system, you could use NLP to extract 'AIML' and add {"department": "AIML"}
        elif "timetable" in intent_str:
            filter_dict = {"category": "Timetable"}
        elif "event" in intent_str:
            filter_dict = {"category": "Events"}
        elif "notice" in intent_str:
            filter_dict = {"category": "Notices"}
            
        return intent_str, filter_dict

    def _format_sources(self, unique_docs):
        sources = []
        for d in unique_docs:
            source = d.metadata.get("source_file", "Unknown")
            page = d.metadata.get("page")
            
            if page:
                formatted = f"{source}, Page {page}"
            else:
                formatted = source
                
            if formatted not in sources:
                sources.append(formatted)
        return sources

    async def ask_stream(self, query: str):
        """
        Ask a question to the AI Assistant and stream the response.
        """
        try:
            llm = get_llm()
            _ = self.vectorstore
        except RuntimeError:
            yield {"type": "stream", "content": "The AI Assistant is currently starting up and loading its knowledge base. Please try again in a few seconds!"}
            yield {"type": "done", "answer": "The AI Assistant is currently starting up and loading its knowledge base. Please try again in a few seconds!", "sources": []}
            return
        
        # 1. Check cache (isolate per session using instance id)
        cache_key = f"{id(self)}_{len(self.chat_history)}_{query}"
        cached_response = query_cache.get(cache_key)
        if cached_response:
            yield {"type": "status", "content": "Retrieving from cache..."}
            yield {"type": "stream", "content": cached_response["answer"]}
            yield {"type": "done", **cached_response}
            return

        total_start = time.time()
        
        # 2. Contextualize query if history exists
        yield {"type": "status", "content": "Contextualizing query..."}
        if self.chat_history:
            contextualize_msg = CONTEXTUALIZE_Q_PROMPT.format_messages(
                chat_history=self.chat_history,
                input=query
            )
            search_query_response = await llm.ainvoke(contextualize_msg)
            search_query = search_query_response.content
        else:
            search_query = query

        # 2.5 Semantic FAQ Engine (Bypass Vector Store if confident match)
        yield {"type": "status", "content": "Analyzing intent..."}
        from .faq_engine import FAQEngine
        faq = FAQEngine.get_instance()
        faq_intent = faq.detect_intent(search_query)
        
        if faq_intent:
            response_text, follow_ups = faq.get_response(faq_intent)
            yield {"type": "stream", "content": response_text}
            
            final_response = {
                "answer": response_text,
                "sources": ["Institutional FAQ & Configuration"],
                "confidence": "High Confidence (Intent Match)",
                "follow_ups": follow_ups,
                "dev_metrics": {
                    "matched_intent": faq_intent,
                    "engine": "Semantic Similarity Classifier",
                    "total_time_ms": round((time.time() - total_start) * 1000, 2)
                }
            }
            query_cache.set(cache_key, final_response)
            yield {"type": "done", **final_response}
            return

        # 3. Query Router (Fallback Intent Detection)
        yield {"type": "status", "content": "Routing intent..."}
        intent_str, filter_dict = await self._detect_intent(search_query, llm)
            
        # 3.5. Live Postgres Query for Faculty
        faculty_context = ""
        if "faculty" in intent_str:
            yield {"type": "status", "content": "Querying live database..."}
            # Extract department
            EXTRACT_PROMPT = f"Extract the department acronym or name (e.g. CSE, IT, Mechanical) from this query. Query: '{search_query}'. Respond ONLY with the department name or acronym. If none is specified, reply with 'none'."
            dept_resp = await llm.ainvoke([HumanMessage(content=EXTRACT_PROMPT)])
            dept = dept_resp.content.strip()
            if dept.lower() in ("none", "null", "", "all"):
                dept = None
                
            from database.config import SessionLocal
            from services.faculty_service import get_faculty_info_from_db
            db = SessionLocal()
            try:
                faculty_context = get_faculty_info_from_db(db, department_filter=dept)
            finally:
                db.close()

        # 4. Hybrid Retrieval
        yield {"type": "status", "content": "Searching Knowledge Base..."}
        start_retrieval = time.time()
        
        # Call the new hybrid_search on CampusRetriever
        docs_with_scores = self.vectorstore.hybrid_search(search_query, k=6, filter_dict=filter_dict if filter_dict else None)
        
        retrieval_time = time.time() - start_retrieval
        
        # 5. Remove duplicates
        seen = set()
        unique_docs = []
        doc_scores = []
        for d, score in docs_with_scores:
            if d.page_content not in seen:
                seen.add(d.page_content)
                unique_docs.append(d)
                doc_scores.append(float(score))
                
        # Simple confidence score based on RRF scores (which are small fractions, usually < 1.0)
        # We'll normalize or just classify it naively
        confidence = "High Confidence" if unique_docs else "Low Confidence"
            
        # 6. Generate answer
        yield {"type": "status", "content": "Generating answer..."}
        start_llm = time.time()
        
        context_str = "\n\n".join(d.page_content for d in unique_docs)
        if faculty_context:
            context_str = faculty_context + "\n\n--- OTHER CONTEXT ---\n" + context_str
            
        rag_msg = RAG_PROMPT.format_messages(
            chat_history=self.chat_history,
            context=context_str,
            input=query
        )
        
        full_answer = ""
        ttft = None
        
        async for chunk in llm.astream(rag_msg):
            if ttft is None:
                ttft = time.time() - start_llm
            full_answer += chunk.content
            yield {"type": "stream", "content": chunk.content}
            
        llm_time = time.time() - start_llm
        total_time = time.time() - total_start
        
        # Update memory
        self.chat_history.append(HumanMessage(content=query))
        self.chat_history.append(AIMessage(content=full_answer))
        
        if len(self.chat_history) > self.max_memory * 2:
            self.chat_history = self.chat_history[-self.max_memory * 2:]
            
        # Prepare Citations & Metadata
        metadata_list = [d.metadata for d in unique_docs]
        sources = self._format_sources(unique_docs)
        
        # Determine internal DB count safely
        try:
            vector_count = len(self.vectorstore.chroma.get()["ids"])
        except Exception:
            vector_count = 0
            
        dev_metrics = {
            "indexed_documents": vector_count,
            "indexed_chunks": vector_count,
            "embedding_model": config.EMBEDDING_MODEL_NAME,
            "top_k": len(unique_docs),
            "retrieval_time_ms": round(retrieval_time * 1000, 2),
            "llm_time_ms": round(llm_time * 1000, 2),
            "ttft_ms": round((ttft or 0) * 1000, 2),
            "total_time_ms": round(total_time * 1000, 2),
            "confidence_level": confidence,
            "intent_filter_applied": filter_dict,
            "retrieved_chunks": [
                {
                    "source": d.metadata.get("source_file", "Unknown"),
                    "page": d.metadata.get("page", "N/A"),
                    "score": round(doc_scores[i], 4),
                    "preview": d.page_content[:150]
                }
                for i, d in enumerate(unique_docs)
            ]
        }
        
        final_response = {
            "answer": full_answer,
            "sources": sources,
            "confidence": confidence,
            "metadata": metadata_list,
            "dev_metrics": dev_metrics
        }
        
        query_cache.set(cache_key, final_response)
        
        yield {"type": "done", **final_response}

    def ask(self, query: str) -> dict:
        """
        Synchronous fallback method for the REST API.
        """
        import asyncio
        async def _run():
            last = None
            async for chunk in self.ask_stream(query):
                if chunk["type"] == "done":
                    last = chunk
            return last
        return asyncio.run(_run())

