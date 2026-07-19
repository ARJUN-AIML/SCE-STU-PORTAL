import logging
from sqlalchemy.orm import Session
from langchain_core.documents import Document
from database.config import SessionLocal
from models.models import TransportRoute

logger = logging.getLogger(__name__)

def generate_transport_document(db: Session):
    routes = db.query(TransportRoute).all()
    if not routes:
        return None
        
    content = ["# Campus Transport Routes\n\nThe following are the available bus and van routes for the campus:\n"]
    
    for r in routes:
        content.append(f"## {r.bus_id} ({r.vehicle_type}) - {r.route_name}")
        content.append(f"- From: {r.from_stop}")
        content.append(f"- To: {r.to_stop}")
        content.append(f"- Final Destination: {r.final_destination}")
        content.append("- Stops along the route: " + " -> ".join(r.stops))
        content.append("")
        
    doc = Document(
        page_content="\n".join(content),
        metadata={"document_type": "transport_summary"}
    )
    return doc

def sync_all_transport_to_chroma():
    try:
        from ai.llm import init_embeddings
        init_embeddings()
        
        from ai.retriever import init_vectorstore, get_vectorstore
        try:
            vs = get_vectorstore()
        except RuntimeError:
            init_vectorstore(force_rebuild=False)
            vs = get_vectorstore()
            
        db = SessionLocal()
        
        collection = vs.chroma._collection
        collection.delete(where={"document_type": {"$eq": "transport_summary"}})
        
        doc = generate_transport_document(db)
        if doc:
            vs.chroma.add_documents([doc], ids=["transport_summary_all"])
            logger.info("Successfully synced transport routes to ChromaDB.")
            
        db.close()
    except Exception as e:
        logger.error(f"Error syncing transport routes: {e}")
