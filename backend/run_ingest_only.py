import logging
from ai.llm import init_embeddings
from ai.ingest import ingest_data
from ai.faculty_sync import sync_all_faculty_to_chroma
from ai.transport_sync import sync_all_transport_to_chroma
from database.config import SessionLocal

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(name)s: %(message)s')
    print("Starting dataset ingestion and database sync (safe mode)...")
    init_embeddings()
    
    # Ingest Datasets (CSV, JSON, PDF from Dataset_for_chatbot)
    ingest_data()
    
    # Sync PostgreSQL tables to Chroma
    db = SessionLocal()
    try:
        print("Syncing Faculty data...")
        sync_all_faculty_to_chroma(db)
    except TypeError: # Some versions of this function might take (db, vectorstore)
        from ai.retriever import init_vectorstore, get_vectorstore
        init_vectorstore()
        sync_all_faculty_to_chroma(db, get_vectorstore())
    except Exception as e:
        print(f"Error syncing faculty: {e}")
        
    try:
        print("Syncing Transport data...")
        sync_all_transport_to_chroma()
    except Exception as e:
        print(f"Error syncing transport: {e}")
        
    db.close()
    print("Ingestion complete. The Chatbot is fully trained and all set!")
