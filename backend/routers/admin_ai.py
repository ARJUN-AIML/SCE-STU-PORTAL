from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from sqlalchemy import func

from database.config import get_db
from models.models import DocumentMetadata
from ai.retriever import get_vectorstore
from auth.firebase import require_current_admin

router = APIRouter(prefix="/admin/knowledge", tags=["Admin Knowledge Dashboard"])

@router.get("/metrics")
async def get_knowledge_metrics(db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    """Fetch metrics for the AI Admin Dashboard."""
    
    total_docs = db.query(func.count(DocumentMetadata.id)).scalar() or 0
    total_chunks = db.query(func.sum(DocumentMetadata.chunks)).scalar() or 0
    failed_docs = db.query(func.count(DocumentMetadata.id)).filter(DocumentMetadata.embedding_status == "failed").scalar() or 0
    ocr_docs = db.query(func.count(DocumentMetadata.id)).filter(DocumentMetadata.ocr_used == True).scalar() or 0
    
    last_indexed_doc = db.query(DocumentMetadata).order_by(DocumentMetadata.last_indexed.desc()).first()
    last_sync = last_indexed_doc.last_indexed.isoformat() if last_indexed_doc and last_indexed_doc.last_indexed else None
    
    try:
        vectorstore = get_vectorstore()
        vector_count = len(vectorstore.chroma.get()["ids"]) if vectorstore.chroma else 0
    except Exception:
        vector_count = 0
        
    # Get document list for the table
    documents = db.query(DocumentMetadata).order_by(DocumentMetadata.upload_time.desc()).limit(50).all()
    
    return {
        "metrics": {
            "total_documents": total_docs,
            "vector_count": vector_count,
            "total_chunks": total_chunks,
            "failed_uploads": failed_docs,
            "ocr_processed": ocr_docs,
            "last_sync": last_sync,
            "health": "Healthy" if failed_docs == 0 else "Degraded"
        },
        "documents": [
            {
                "id": doc.id,
                "name": doc.document_name,
                "type": doc.file_type,
                "status": doc.embedding_status,
                "chunks": doc.chunks,
                "pages": doc.pages,
                "ocr": doc.ocr_used,
                "uploaded_at": doc.upload_time.isoformat() if doc.upload_time else None
            } for doc in documents
        ]
    }

@router.post("/rebuild")
async def rebuild_knowledge_base(background_tasks: BackgroundTasks, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    """Clear all vector data and re-index from scratch."""
    from ai.assistant import CollegeAIAssistant
    assistant = CollegeAIAssistant()
    
    # Run in background
    background_tasks.add_task(assistant.rebuild)
    
    # Reset DB statuses
    db.query(DocumentMetadata).update({
        DocumentMetadata.embedding_status: "pending",
        DocumentMetadata.chunks: 0
    })
    db.commit()
    
    return {"message": "Knowledge base rebuild started in background."}
