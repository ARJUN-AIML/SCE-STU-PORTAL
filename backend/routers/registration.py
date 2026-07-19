from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from database.config import get_db
from models.models import Registration, Event
from schemas.schemas import RegisterRequest
from auth.firebase import require_current_user

router = APIRouter()

@router.post("/register")
async def register(
    req: RegisterRequest, 
    db: Session = Depends(get_db), 
    user = Depends(require_current_user)
):
    try:
        event_id_int = int(req.event_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid event ID format")

    event = db.query(Event).filter(Event.id == event_id_int).first()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    if event.status != "open":
        raise HTTPException(status_code=400, detail="Event registration is not open")
        
    if event.seats_total > 0 and event.seats_filled >= event.seats_total:
        raise HTTPException(status_code=400, detail="Event capacity exceeded")
        
    student_uid = user.firebase_uid
    
    existing = db.query(Registration).filter(
        Registration.student_uid == student_uid,
        Registration.event_id == req.event_id
    ).first()
    
    if existing:
        return JSONResponse(
            status_code=409, 
            content={"success": False, "message": "You have already registered for this event."}
        )
        
    reg = Registration(
        student_uid=student_uid,
        event_id=req.event_id,
        event_title=event.title,
        full_name=req.name,
        email=req.email,
        roll_number=req.rollNumber,
        notes=req.notes,
        registration_status="Registered"
    )
    db.add(reg)
    
    try:
        if event.seats_total > 0:
            event.seats_filled += 1
        db.commit()
    except IntegrityError:
        db.rollback()
        return JSONResponse(
            status_code=409, 
            content={"success": False, "message": "You have already registered for this event."}
        )
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Registration failed. Please try again.")
        
    return {"success": True, "data": {"status": "registered"}, "message": "Successfully registered for the event."}

@router.get("/my-registrations")
async def get_my_registrations(
    db: Session = Depends(get_db),
    user = Depends(require_current_user)
):
    registrations = db.query(Registration).filter(Registration.student_uid == user.firebase_uid).all()
    return {"success": True, "data": registrations}

@router.get("/admin/events/{event_id}/registrations")
async def get_admin_registrations(
    event_id: str,
    db: Session = Depends(get_db),
    user = Depends(require_current_user)
):
    if user.role != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
        
    registrations = db.query(Registration).filter(Registration.event_id == event_id).all()
    return {"success": True, "data": registrations}

