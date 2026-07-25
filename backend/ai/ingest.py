import json
import csv
import logging
from pathlib import Path
import fitz  # PyMuPDF


from langchain_community.document_loaders import TextLoader
from langchain_core.documents import Document
from langchain_experimental.text_splitter import SemanticChunker
from langchain_chroma import Chroma
from sqlalchemy.orm import Session
from datetime import datetime

from . import config
from .llm import get_embeddings
from database.config import SessionLocal
from models.models import DocumentMetadata

logger = logging.getLogger(__name__)

# Configure tesseract path if needed for Windows, assuming it's in PATH or standard location
# pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def _load_json(file_path: Path):
    documents = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if isinstance(data, list):
                for item in data:
                    text = json.dumps(item, indent=2)
                    meta = {
                        "source_file": file_path.name,
                        "document_type": "json"
                    }
                    if "event_name" in item:
                        meta["title"] = item["event_name"]
                    documents.append(Document(page_content=text, metadata=meta))
            else:
                text = json.dumps(data, indent=2)
                documents.append(Document(page_content=text, metadata={
                    "source_file": file_path.name,
                    "document_type": "json"
                }))
    except Exception as e:
        logger.error(f"Error loading JSON {file_path}: {e}")
    return documents

def _load_csv(file_path: Path):
    documents = []
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            for row in reader:
                content = "\n".join([f"{k}: {v}" for k, v in row.items()])
                meta = {
                    "source_file": file_path.name,
                    "document_type": "csv"
                }
                if "course_code" in row:
                    meta["department"] = "".join(filter(str.isalpha, row["course_code"]))
                if "course_name" in row:
                    meta["title"] = row["course_name"]
                    
                documents.append(Document(page_content=content, metadata=meta))
    except Exception as e:
        logger.error(f"Error loading CSV {file_path}: {e}")
    return documents

def _extract_pdf_hybrid(file_path: Path) -> tuple[list[Document], bool, int]:
    """Extract text from PDF using PyMuPDF only."""
    documents = []
    ocr_used = False

    try:
        doc = fitz.open(str(file_path))
        num_pages = len(doc)

        for page_num in range(num_pages):
            page = doc.load_page(page_num)
            text = page.get_text("text")

            if text.strip():
                documents.append(
                    Document(
                        page_content=text,
                        metadata={
                            "source_file": file_path.name,
                            "document_type": "pdf",
                            "page": page_num + 1,
                        },
                    )
                )

        doc.close()
        return documents, ocr_used, num_pages

    except Exception as e:
        logger.error(f"Error parsing PDF {file_path}: {e}")
        return [], False, 0

def process_file(file_path: Path, db: Session, vectorstore: Chroma, uploaded_by: str = "system") -> bool:
    """Processes a single file, chunks it, embeds it, and updates DB metadata."""
    logger.info(f"Processing {file_path.name}...")
    
    # Check if already processed
    existing_meta = db.query(DocumentMetadata).filter(DocumentMetadata.document_name == file_path.name).first()
    if existing_meta and existing_meta.embedding_status == "success":
        logger.info(f"{file_path.name} is already indexed. Skipping.")
        return True
        
    meta_record = existing_meta or DocumentMetadata(
        document_name=file_path.name,
        file_type=file_path.suffix.lower(),
        uploaded_by=uploaded_by
    )
    if not existing_meta:
        db.add(meta_record)
    
    meta_record.embedding_status = "processing"
    db.commit()
    
    documents = []
    ocr_used = False
    num_pages = 0
    
    try:
        ext = file_path.suffix.lower()
        if ext == ".pdf":
            documents, ocr_used, num_pages = _extract_pdf_hybrid(file_path)
            meta_record.pages = num_pages
            meta_record.ocr_used = ocr_used
        elif ext == ".txt":
            loader = TextLoader(str(file_path), encoding='utf-8')
            docs = loader.load()
            for doc in docs:
                doc.metadata["source_file"] = file_path.name
                doc.metadata["document_type"] = "txt"
            documents.extend(docs)
            meta_record.pages = 1
        elif ext == ".csv":
            documents = _load_csv(file_path)
            meta_record.pages = 1
        elif ext == ".json":
            documents = _load_json(file_path)
            meta_record.pages = 1
        else:
            logger.warning(f"Unsupported file type: {ext}")
            meta_record.embedding_status = "failed"
            db.commit()
            return False
            
        if not documents:
            logger.warning(f"No text extracted from {file_path.name}")
            meta_record.embedding_status = "failed"
            db.commit()
            return False
            
        # Semantic Chunking (only for unstructured text like PDF/TXT)
        if ext in [".pdf", ".txt"]:
            embeddings = get_embeddings()
            text_splitter = SemanticChunker(embeddings)
            chunks = text_splitter.split_documents(documents)
        else:
            # CSV and JSON are already chunked per row/object
            chunks = documents
        
        meta_record.chunks = len(chunks)
        
        import time
        batch_size = 50
        total_chunks = len(chunks)
        
        for i in range(0, total_chunks, batch_size):
            batch = chunks[i:i + batch_size]
            max_retries = 5
            base_delay = 10
            
            for attempt in range(max_retries):
                try:
                    vectorstore.add_documents(documents=batch)
                    time.sleep(0.3)  # Rate limit breathing space
                    break
                except Exception as e:
                    error_msg = str(e).lower()
                    if "429" in error_msg or "resource_exhausted" in error_msg or "quota" in error_msg:
                        if attempt < max_retries - 1:
                            delay = base_delay * (2 ** attempt)
                            logger.warning(f"Rate limit hit (429) on {file_path.name} batch {i//batch_size + 1}. Retrying in {delay}s...")
                            time.sleep(delay)
                        else:
                            logger.error(f"Failed to ingest {file_path.name} batch {i//batch_size + 1} after {max_retries} retries.")
                            raise e
                    else:
                        raise e
        
        # Update Meta
        meta_record.embedding_status = "success"
        meta_record.last_indexed = datetime.utcnow()
        db.commit()
        
        logger.info(f"Successfully ingested {file_path.name}: {len(chunks)} chunks.")
        return True
        
    except Exception as e:
        logger.error(f"Failed to ingest {file_path.name}: {e}")
        meta_record.embedding_status = "failed"
        db.commit()
        return False

def ingest_data(vectorstore=None):
    """Scans DATA_DIR for new files and ingests them."""
    data_dir = config.DATA_DIR
    if not data_dir.exists() or not data_dir.is_dir():
        logger.warning(f"Data directory '{data_dir}' does not exist.")
        return vectorstore, True

    if vectorstore is None:
        embeddings = get_embeddings()
        vectorstore = Chroma(
            persist_directory=str(config.CHROMA_DB_DIR),
            embedding_function=embeddings
        )

    all_success = True
    db = SessionLocal()
    try:
        for file_path in data_dir.rglob("*.*"):
            if file_path.suffix.lower() in [".pdf", ".txt", ".csv", ".json"]:
                file_success = process_file(file_path, db, vectorstore)
                if not file_success:
                    all_success = False
    finally:
        db.close()
        
    return vectorstore, all_success

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    ingest_data()
