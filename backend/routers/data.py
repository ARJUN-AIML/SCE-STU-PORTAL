from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session, joinedload
from database.config import get_db
from models.models import (
    Event, Club, Faculty, TimetableEntry, Notice, Resource,
    TransportRoute, LibraryBook, Building, Department, Registration
)
from schemas.schemas import StandardResponse
from auth.firebase import get_current_user_optional
from services.ai_image_service import generate_and_upload_cover

router = APIRouter()

@router.get("/events", response_model=StandardResponse)
async def get_events(background_tasks: BackgroundTasks, db: Session = Depends(get_db), user = Depends(get_current_user_optional)):
    events = db.query(Event).all()
    user_regs = set()
    if user:
        regs = db.query(Registration.event_id).filter(Registration.student_uid == user.firebase_uid).all()
        user_regs = {r[0] for r in regs}
        
    data = []
    for e in events:
        if not e.image_url and e.image_generation_status not in ["Completed", "Processing", "Failed"]:
            # e.image_generation_status is initially "Pending"
            background_tasks.add_task(generate_and_upload_cover, e.id)
            
        data.append({
            "id": str(e.id), "title": e.title, "description": e.description,
            "type": e.type, "thumbnail": e.thumbnail, "date": e.date.isoformat() if e.date else "",
            "time": e.time, "venue": e.venue, "coordinator": e.coordinator,
            "seats_total": e.seats_total, "seats_filled": e.seats_filled,
            "is_recommended": e.is_recommended, "status": e.status,
            "registered": str(e.id) in user_regs,
            "image_url": e.image_url,
            "image_generation_status": e.image_generation_status
        })
    return StandardResponse(success=True, data=data, message="Events loaded successfully")

@router.get("/clubs", response_model=StandardResponse)
def get_clubs(db: Session = Depends(get_db)):
    clubs = db.query(Club).all()
    data = [{
        "id": str(c.id), "title": c.title, "description": c.description,
        "category": c.category, "thumbnail": c.thumbnail, "coordinator": c.coordinator,
        "status": c.status, "is_recommended": c.is_recommended
    } for c in clubs]
    return StandardResponse(success=True, data=data, message="Clubs loaded successfully")

@router.get("/faculty", response_model=StandardResponse)
def get_faculty(db: Session = Depends(get_db)):
    faculty = db.query(Faculty).options(joinedload(Faculty.department)).all()
    data = [{
        "id": str(f.id), "name": f.full_name, "role": f.designation,
        "department": f.department.name if f.department else "",
        "email": f.email, "phone": f.phone, "office": f.office_room,
        "office_hours": f.office_hours, "avatar": f.image_url, "expertise": f.expertise or [],
        "status": f.status
    } for f in faculty]
    return StandardResponse(success=True, data=data, message="Faculty loaded successfully")

@router.get("/schedule", response_model=StandardResponse)
def get_schedule(db: Session = Depends(get_db)):
    schedule = db.query(TimetableEntry).all()
    data = [{
        "id": str(s.id), "course_code": s.course_code, "course_name": s.course_name,
        "department": s.department_id, "semester": s.semester, "section": s.section,
        "day": s.day_of_week, "start_time": s.start_time, "end_time": s.end_time,
        "room": s.room, "faculty_id": s.faculty_id
    } for s in schedule]
    return StandardResponse(success=True, data=data, message="Schedule loaded successfully")

@router.get("/notices", response_model=StandardResponse)
def get_notices(db: Session = Depends(get_db)):
    notices = db.query(Notice).order_by(Notice.publish_date.desc()).all()
    data = [{
        "id": str(n.id), "title": n.title, "content": n.content,
        "type": n.type, "category": n.category, "priority": n.priority,
        "author": n.author, "date": n.publish_date.isoformat() if n.publish_date else ""
    } for n in notices]
    return StandardResponse(success=True, data=data, message="Notices loaded successfully")

@router.get("/resources", response_model=StandardResponse)
def get_resources(db: Session = Depends(get_db)):
    resources = db.query(Resource).all()
    data = [{
        "id": str(r.id), "title": r.title, "description": r.description,
        "type": r.type, "category": r.category, "url": r.url,
        "size": r.size, "uploaded_by": r.uploaded_by
    } for r in resources]
    return StandardResponse(success=True, data=data, message="Resources loaded successfully")

@router.get("/transport", response_model=StandardResponse)
def get_transport(db: Session = Depends(get_db)):
    transport = db.query(TransportRoute).all()
    data = [{
        "id": str(t.id), "bus_id": t.bus_id, "route_name": t.route_name,
        "from_stop": t.from_stop, "to_stop": t.to_stop,
        "final_destination": t.final_destination, "vehicle_type": t.vehicle_type,
        "stops": t.stops
    } for t in transport]
    return StandardResponse(success=True, data=data, message="Transport loaded successfully")

@router.get("/transport/{id}", response_model=StandardResponse)
def get_transport_by_id(id: int, db: Session = Depends(get_db)):
    t = db.query(TransportRoute).filter(TransportRoute.id == id).first()
    if not t: return StandardResponse(success=False, message="Not found")
    data = {
        "id": str(t.id), "bus_id": t.bus_id, "route_name": t.route_name,
        "from_stop": t.from_stop, "to_stop": t.to_stop,
        "final_destination": t.final_destination, "vehicle_type": t.vehicle_type,
        "stops": t.stops
    }
    return StandardResponse(success=True, data=data, message="Loaded successfully")

@router.get("/transport/search", response_model=StandardResponse)
def search_transport(q: str, type: str = None, db: Session = Depends(get_db)):
    query = db.query(TransportRoute)
    if type and type.lower() != "all":
        query = query.filter(TransportRoute.vehicle_type.ilike(f"%{type}%"))
    
    routes = query.all()
    filtered = []
    q_lower = q.lower()
    for r in routes:
        if (q_lower in (r.bus_id or "").lower() or 
            q_lower in (r.route_name or "").lower() or 
            any(q_lower in stop.lower() for stop in r.stops)):
            filtered.append(r)
            
    data = [{
        "id": str(t.id), "bus_id": t.bus_id, "route_name": t.route_name,
        "from_stop": t.from_stop, "to_stop": t.to_stop,
        "final_destination": t.final_destination, "vehicle_type": t.vehicle_type,
        "stops": t.stops
    } for t in filtered]
    return StandardResponse(success=True, data=data, message="Search complete")

@router.get("/library", response_model=StandardResponse)
def get_library(db: Session = Depends(get_db)):
    library = db.query(LibraryBook).all()
    data = [{
        "id": str(l.id), "title": l.title, "author": l.author, "isbn": l.isbn,
        "category": l.category, "cover_image": l.cover_image,
        "total_copies": l.total_copies, "available_copies": l.available_copies,
        "status": l.status
    } for l in library]
    return StandardResponse(success=True, data=data, message="Library loaded successfully")

@router.get("/departments", response_model=StandardResponse)
def get_departments(db: Session = Depends(get_db)):
    departments = (
        db.query(Department)
        .options(joinedload(Department.faculty), joinedload(Department.hod))
        .all()
    )
    data = [{
        "id": str(d.id),
        "code": d.code,
        "name": d.name,
        "description": d.description,
        "hod": {"name": d.hod.full_name, "email": d.hod.email} if d.hod else None,
        "facultyCount": len(d.faculty)
    } for d in departments]
    return StandardResponse(success=True, data=data, message="Departments loaded successfully")

@router.get("/departments/{id}", response_model=StandardResponse)
def get_department(id: int, db: Session = Depends(get_db)):
    d = (
        db.query(Department)
        .options(joinedload(Department.faculty), joinedload(Department.hod))
        .filter(Department.id == id)
        .first()
    )
    if not d:
        return StandardResponse(success=False, message="Department not found")
    data = {
        "id": str(d.id),
        "code": d.code,
        "name": d.name,
        "description": d.description,
        "hod": {"name": d.hod.full_name, "email": d.hod.email} if d.hod else None,
        "facultyCount": len(d.faculty)
    }
    return StandardResponse(success=True, data=data, message="Department loaded successfully")

@router.get("/departments/{id}/faculty", response_model=StandardResponse)
def get_department_faculty(id: int, db: Session = Depends(get_db)):
    faculty = db.query(Faculty).filter(Faculty.department_id == id).all()
    
    # Custom sort: Principal > Dean > HOD > Professor > Associate > Assistant > Others
    _ADMIN_ROLE_RANK = {
        "principal": 0,
        "dean": 1,
        "hod": 2,
    }
    _DESIGNATION_RANK = {
        "professor": 3,
        "associate professor": 4,
        "assistant professor": 5,
    }

    def get_rank(f: Faculty):
        admin = (f.administrative_role or "").strip().lower()
        if admin in _ADMIN_ROLE_RANK:
            return _ADMIN_ROLE_RANK[admin]
        desig = (f.designation or "").strip().lower()
        if desig in _DESIGNATION_RANK:
            return _DESIGNATION_RANK[desig]
        return 6

    faculty.sort(key=get_rank)
    
    data = [{
        "id": str(f.id),
        "full_name": f.full_name,
        "designation": f.designation,
        "administrative_role": f.administrative_role,
        "email": f.email,
        "qualification": f.qualification,
        "specialization": f.specialization,
        "office_room": f.office_room,
        "image_url": f.image_url,
    } for f in faculty]
    return StandardResponse(success=True, data=data, message="Faculty loaded successfully")

@router.get("/search", response_model=StandardResponse)
def search_all(query: str, db: Session = Depends(get_db)):
    query = query.lower()
    
    events = db.query(Event).filter(Event.title.ilike(f"%{query}%")).all()
    clubs = db.query(Club).filter(Club.title.ilike(f"%{query}%")).all()
    
    # Search faculty by name, designation, admin role, email, specialization, qualification
    faculty = db.query(Faculty).filter(
        (Faculty.full_name.ilike(f"%{query}%")) |
        (Faculty.designation.ilike(f"%{query}%")) |
        (Faculty.administrative_role.ilike(f"%{query}%")) |
        (Faculty.email.ilike(f"%{query}%")) |
        (Faculty.specialization.ilike(f"%{query}%")) |
        (Faculty.qualification.ilike(f"%{query}%"))
    ).all()
    
    notices = db.query(Notice).filter(Notice.title.ilike(f"%{query}%")).all()
    buildings = db.query(Building).filter(Building.name.ilike(f"%{query}%")).all()
    
    # Search departments
    departments = db.query(Department).filter(
        (Department.name.ilike(f"%{query}%")) |
        (Department.code.ilike(f"%{query}%"))
    ).all()
    
    results = {
        "events": [{"id": str(e.id), "title": e.title} for e in events],
        "clubs": [{"id": str(c.id), "title": c.title} for c in clubs],
        "faculty": [{"id": str(f.id), "title": f.full_name, "department_id": f.department_id} for f in faculty],
        "notices": [{"id": str(n.id), "title": n.title} for n in notices],
        "buildings": [{"id": str(b.id), "title": b.name} for b in buildings],
        "departments": [{"id": str(d.id), "title": d.name} for d in departments],
    }
    return StandardResponse(success=True, data=results, message="Search completed")

@router.get("/map/buildings", response_model=StandardResponse)
def get_buildings(db: Session = Depends(get_db)):
    buildings = db.query(Building).all()
    data = [{
        "id": str(b.id), "name": b.name, "description": b.description,
        "code": b.code, "coordinates": b.coordinates, "working_hours": b.working_hours,
        "nearby_facilities": b.nearby_facilities
    } for b in buildings]
    return StandardResponse(success=True, data=data, message="Buildings loaded successfully")

@router.get("/map/location/{room}", response_model=StandardResponse)
def get_location(room: str, db: Session = Depends(get_db)):
    room = room.lower()
    b = db.query(Building).filter(Building.code.ilike(f"%{room}%")).first()
    if b:
        data = {
            "id": str(b.id), "name": b.name, "description": b.description,
            "code": b.code, "coordinates": b.coordinates
        }
        return StandardResponse(success=True, data=data, message="Location found")
    return StandardResponse(success=False, message="Location not found")
