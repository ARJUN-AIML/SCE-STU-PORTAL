import logging
from sqlalchemy.orm import Session
from models.models import Department, Faculty
from langchain_core.documents import Document

logger = logging.getLogger(__name__)

def generate_lightweight_faculty_document(db: Session, department_id: int):
    """
    Generates a high-level summary of the department's faculty.
    """
    dept = db.query(Department).filter(Department.id == department_id).first()
    if not dept:
        return None
        
    faculty = db.query(Faculty).filter(Faculty.department_id == department_id).all()
    
    if not faculty:
        logger.info(f"No faculty found for department {dept.name}")
        return None
        
    hod = next((f for f in faculty if "hod" in (f.administrative_role or "").lower() or "hod" in (f.designation or "").lower() or "head" in (f.administrative_role or "").lower()), None)
    
    text = f"Department: {dept.name}\n"
    if dept.code:
        text += f"Code: {dept.code}\n"
        
    if hod:
        text += f"\nHead of Department: {hod.full_name}\n"
        
    professors = [f.full_name for f in faculty if "professor" in (f.designation or "").lower() and "assistant" not in (f.designation or "").lower() and "associate" not in (f.designation or "").lower()]
    associate = [f.full_name for f in faculty if "associate professor" in (f.designation or "").lower()]
    assistant = [f.full_name for f in faculty if "assistant professor" in (f.designation or "").lower()]
    
    text += "\nFaculty Members:\n"
    if professors:
        text += f"Professors: {', '.join(professors)}\n"
    if associate:
        text += f"Associate Professors: {', '.join(associate)}\n"
    if assistant:
        text += f"Assistant Professors: {', '.join(assistant)}\n"
        
    # Anyone else
    others = [f.full_name for f in faculty if f.full_name not in professors and f.full_name not in associate and f.full_name not in assistant and f != hod]
    if others:
        text += f"Other Faculty: {', '.join(others)}\n"
        
    doc = Document(
        page_content=text,
        metadata={
            "source_file": "PostgreSQL Database",
            "document_type": "faculty_summary",
            "department_id": dept.id,
            "department_name": dept.name
        }
    )
    return doc

def sync_department_faculty_to_chroma(db: Session, dept_id: int, vectorstore):
    """
    Syncs the lightweight faculty summary for a specific department to Chroma.
    """
    try:
        # Delete old document for this department
        # Since LangChain's Chroma wrapper doesn't directly support metadata-based deletion easily via .delete()
        # We access the underlying collection
        collection = vectorstore.chroma._collection
        collection.delete(where={"$and": [{"document_type": {"$eq": "faculty_summary"}}, {"department_id": {"$eq": dept_id}}]})
        
        doc = generate_lightweight_faculty_document(db, dept_id)
        if doc:
            vectorstore.chroma.add_documents([doc], ids=[f"faculty_summary_{dept_id}"])
            logger.info(f"Synced lightweight faculty summary for department {dept_id}")
            
    except Exception as e:
        logger.error(f"Failed to sync faculty to Chroma for department {dept_id}: {e}")

def sync_all_faculty_to_chroma(db: Session, vectorstore):
    departments = db.query(Department).all()
    for d in departments:
        sync_department_faculty_to_chroma(db, d.id, vectorstore)
