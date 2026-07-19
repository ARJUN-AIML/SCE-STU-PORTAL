from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.config import get_db
from models.models import Faculty, Event, Notice
from schemas.schemas import StandardResponse
from pydantic import BaseModel
from typing import Optional
from fastapi import BackgroundTasks
from ai.retriever import get_vectorstore
from ai.faculty_sync import sync_department_faculty_to_chroma

router = APIRouter(prefix="/admin", tags=["Admin CMS"])

from auth.firebase import require_current_admin

# --- FACULTY CRUD ---

class FacultyCreate(BaseModel):
    name: str
    designation: str
    email: str
    department_id: Optional[int] = None
    phone: Optional[str] = None

@router.post("/faculty", response_model=StandardResponse)
async def create_faculty(data: FacultyCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    f = Faculty(**data.dict())
    db.add(f)
    db.commit()
    db.refresh(f)
    if f.department_id:
        try:
            vs = get_vectorstore()
            background_tasks.add_task(sync_department_faculty_to_chroma, db, f.department_id, vs)
        except Exception:
            pass
    return StandardResponse(success=True, data={"id": f.id}, message="Faculty created")

@router.put("/faculty/{id}", response_model=StandardResponse)
async def update_faculty(id: int, data: FacultyCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    f = db.query(Faculty).filter(Faculty.id == id).first()
    if not f: raise HTTPException(404, "Not found")
    
    old_dept_id = f.department_id
    
    for k, v in data.dict().items():
        setattr(f, k, v)
    db.commit()
    
    try:
        vs = get_vectorstore()
        dept_ids = {old_dept_id, f.department_id} - {None}
        for d_id in dept_ids:
            background_tasks.add_task(sync_department_faculty_to_chroma, db, d_id, vs)
    except Exception:
        pass
        
    return StandardResponse(success=True, message="Faculty updated")

@router.delete("/faculty/{id}", response_model=StandardResponse)
async def delete_faculty(id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    f = db.query(Faculty).filter(Faculty.id == id).first()
    if not f: raise HTTPException(404, "Not found")
    
    dept_id = f.department_id
    db.delete(f)
    db.commit()
    
    if dept_id:
        try:
            vs = get_vectorstore()
            background_tasks.add_task(sync_department_faculty_to_chroma, db, dept_id, vs)
        except Exception:
            pass
            
    return StandardResponse(success=True, message="Faculty deleted")

# --- EVENTS CRUD ---

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    type: Optional[str] = None
    date: Optional[str] = None
    venue: Optional[str] = None

@router.post("/events", response_model=StandardResponse)
async def create_event(data: EventCreate, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    e = Event(**data.dict())
    db.add(e)
    db.commit()
    db.refresh(e)
    return StandardResponse(success=True, data={"id": e.id}, message="Event created")

@router.delete("/events/{id}", response_model=StandardResponse)
async def delete_event(id: int, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    e = db.query(Event).filter(Event.id == id).first()
    if not e: raise HTTPException(404, "Not found")
    db.delete(e)
    db.commit()
    return StandardResponse(success=True, message="Event deleted")

# --- NOTICES CRUD ---

class NoticeCreate(BaseModel):
    title: str
    content: Optional[str] = None
    type: Optional[str] = None
    author: Optional[str] = None

@router.post("/notices", response_model=StandardResponse)
async def create_notice(data: NoticeCreate, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    n = Notice(**data.dict())
    db.add(n)
    db.commit()
    db.refresh(n)
    return StandardResponse(success=True, data={"id": n.id}, message="Notice created")

@router.delete("/notices/{id}", response_model=StandardResponse)
async def delete_notice(id: int, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    n = db.query(Notice).filter(Notice.id == id).first()
    if not n: raise HTTPException(404, "Not found")
    db.delete(n)
    db.commit()
    return StandardResponse(success=True, message="Notice deleted")
