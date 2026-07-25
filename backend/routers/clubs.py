from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.config import get_db
from models.models import ClubRegistration
from schemas.schemas import StandardResponse
from auth.firebase import require_current_admin
from pydantic import BaseModel, validator
from typing import Optional

router = APIRouter(prefix="/clubs", tags=["Clubs"])

class ClubRegistrationRequest(BaseModel):
    student_name: str
    batch_no: str
    department: str
    year: str
    mobile_number: str
    college_email: str
    club_name: str

    @validator('college_email')
    def validate_college_email(cls, v):
        email_clean = v.strip().lower()
        if not email_clean.endswith('@saranathan.ac.in'):
            raise ValueError('Email must end with @saranathan.ac.in')
        return email_clean

class UpdateStatusRequest(BaseModel):
    status: str
    
    @validator('status')
    def validate_status(cls, v):
        if v not in ['Pending', 'Approved', 'Rejected']:
            raise ValueError('Status must be Pending, Approved, or Rejected')
        return v

@router.post("/register", response_model=StandardResponse)
async def register_for_club(request: ClubRegistrationRequest, db: Session = Depends(get_db)):
    try:
        new_reg = ClubRegistration(
            student_name=request.student_name,
            batch_no=request.batch_no,
            department=request.department,
            year=request.year,
            mobile_number=request.mobile_number,
            college_email=request.college_email,
            club_name=request.club_name,
            status="Pending"
        )
        db.add(new_reg)
        db.commit()
        db.refresh(new_reg)
        
        return StandardResponse(
            success=True,
            message=f"Successfully registered for {request.club_name}. Awaiting approval.",
            data={"id": str(new_reg.id)}
        )
    except Exception as e:
        db.rollback()
        return StandardResponse(success=False, message=str(e))

@router.get("/admin/registrations", response_model=StandardResponse)
async def get_all_registrations(club_name: Optional[str] = None, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    query = db.query(ClubRegistration)
    if club_name:
        query = query.filter(ClubRegistration.club_name.ilike(f"%{club_name}%"))
        
    registrations = query.order_by(ClubRegistration.applied_at.desc()).all()
    
    data = [{
        "id": str(r.id),
        "student_name": r.student_name,
        "batch_no": r.batch_no,
        "department": r.department,
        "year": r.year,
        "mobile_number": r.mobile_number,
        "college_email": r.college_email,
        "club_name": r.club_name,
        "status": r.status,
        "applied_at": r.applied_at.isoformat() if r.applied_at else ""
    } for r in registrations]
    
    return StandardResponse(success=True, data=data, message="Registrations fetched successfully")

@router.patch("/admin/registrations/{id}/status", response_model=StandardResponse)
async def update_registration_status(id: int, request: UpdateStatusRequest, db: Session = Depends(get_db), admin=Depends(require_current_admin)):
    reg = db.query(ClubRegistration).filter(ClubRegistration.id == id).first()
    if not reg:
        return StandardResponse(success=False, message="Registration not found")
        
    reg.status = request.status
    db.commit()
    
    return StandardResponse(success=True, message=f"Registration status updated to {request.status}")
