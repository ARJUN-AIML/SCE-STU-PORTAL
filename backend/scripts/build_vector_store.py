"""
Offline Vector Store Builder for SCE Student Portal.

Run this script locally whenever the dataset changes:

    python backend/scripts/build_vector_store.py

It will:
  1. Initialize the embedding model (BAAI/bge-small-en-v1.5)
  2. Read all CSV, JSON, PDF, and TXT files from Dataset_for_chatbot/
  3. Chunk and embed documents
  4. Persist the ChromaDB index to backend/chroma_db/
  5. Sync faculty and transport data from PostgreSQL into ChromaDB

After running, commit the updated backend/chroma_db/ directory and push.
Railway will load the pre-built index without downloading any HuggingFace models.
"""

import sys
import os
import shutil
import logging
import time

# Ensure the backend directory is on sys.path so imports resolve correctly
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, BACKEND_DIR)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("build_vector_store")


def main():
    t0 = time.time()

    # ── 1. Initialize Embeddings ─────────────────────────────────────────
    logger.info("Initializing embedding model...")
    from ai.llm import get_embeddings
    embeddings = get_embeddings()
    if embeddings is None:
        logger.error("Failed to initialize embeddings. Cannot build vector store.")
        sys.exit(1)

    # ── 2. Clear existing ChromaDB ───────────────────────────────────────
    from ai import config
    chroma_dir = config.CHROMA_DB_DIR

    if chroma_dir.exists():
        logger.info(f"Deleting existing ChromaDB at {chroma_dir}...")
        try:
            shutil.rmtree(chroma_dir, ignore_errors=True)
        except Exception as e:
            logger.warning(f"Could not delete ChromaDB directory cleanly: {e}")
        
        # Clear the PostgreSQL ingestion metadata so files aren't skipped
        from database.config import SessionLocal
        from models.models import DocumentMetadata
        db = SessionLocal()
        try:
            deleted = db.query(DocumentMetadata).delete()
            db.commit()
            logger.info(f"Cleared {deleted} records from document metadata registry.")
        except Exception as e:
            logger.error(f"Failed to clear document metadata: {e}")
        finally:
            db.close()

    chroma_dir.mkdir(parents=True, exist_ok=True)

    # ── 3. Create fresh ChromaDB and ingest all datasets ─────────────────
    from langchain_chroma import Chroma
    vectorstore = Chroma(
        persist_directory=str(chroma_dir),
        embedding_function=embeddings
    )

    from ai.ingest import ingest_data
    logger.info("Ingesting datasets from Dataset_for_chatbot/...")
    vectorstore, all_success = ingest_data(vectorstore)

    # ── 4. Sync PostgreSQL data (faculty, transport) ─────────────────────
    from database.config import SessionLocal

    db = SessionLocal()
    try:
        # Faculty sync
        logger.info("Syncing faculty data from PostgreSQL...")
        from ai.faculty_sync import sync_all_faculty_to_chroma
        from ai.retriever import init_vectorstore, get_vectorstore

        # We need a CampusRetriever wrapper for sync functions that expect it
        init_vectorstore()
        vs = get_vectorstore()

        sync_all_faculty_to_chroma(db, vs)

        # Transport sync
        logger.info("Syncing transport data from PostgreSQL...")
        from ai.transport_sync import sync_all_transport_to_chroma
        sync_all_transport_to_chroma()

    except Exception as e:
        logger.warning(f"PostgreSQL sync skipped or partially failed: {e}")
    finally:
        db.close()

    # ── 5. Report results ────────────────────────────────────────────────
    try:
        chunk_count = vectorstore._collection.count() if vectorstore._collection else 0
        
        # Get exact stats from DB
        from database.config import SessionLocal
        from models.models import DocumentMetadata
        from sqlalchemy import func
        db = SessionLocal()
        try:
            csv_count = db.query(DocumentMetadata).filter(DocumentMetadata.file_type == '.csv', DocumentMetadata.embedding_status == 'success').count()
            docs_created = db.query(DocumentMetadata).filter(DocumentMetadata.embedding_status == 'success').count()
            chunks_created = db.query(DocumentMetadata).filter(DocumentMetadata.embedding_status == 'success').with_entities(func.sum(DocumentMetadata.chunks)).scalar() or 0
        except Exception:
            csv_count = 0
            docs_created = 0
            chunks_created = 0
        finally:
            db.close()
            
    except Exception:
        chunk_count = 0
        csv_count = 0
        docs_created = 0
        chunks_created = 0

    elapsed = round(time.time() - t0, 2)

    logger.info("=" * 60)
    logger.info("Vector Store Build Complete")
    logger.info(f"  CSV files processed : {csv_count}")
    logger.info(f"  Documents created   : {docs_created}")
    logger.info(f"  Chunks created      : {chunks_created}")
    logger.info(f"  Chroma count        : {chunk_count}")
    logger.info(f"  Output directory    : {chroma_dir}")
    logger.info(f"  Elapsed time        : {elapsed}s")
    logger.info("=" * 60)
    logger.info("")
    logger.info("Next steps:")
    logger.info("  1. git add backend/chroma_db/")
    logger.info("  2. git commit -m 'Update vector store index'")
    logger.info("  3. git push")
    logger.info("")

    if not all_success:
        logger.error("Build finished with skipped or failed datasets due to rate limits or errors.")
        logger.error("The vector store is incomplete. Please run the build script again.")
        sys.exit(1)

if __name__ == "__main__":
    main()
