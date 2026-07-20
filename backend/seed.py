import os
import pandas as pd
from sqlalchemy.orm import Session
from database.config import SessionLocal, engine, Base
from models.models import (
    Department, Faculty, Event, Club, Notice, Resource, TimetableEntry,
    TransportRoute, LibraryBook, Building
)
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Ensure tables exist
Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    try:
        from ai.config import DATA_DIR
        base_dir = str(DATA_DIR)
        
        # 1. Departments
        dept_path = os.path.join(base_dir, "departments.csv")
        if os.path.exists(dept_path):
            df = pd.read_csv(dept_path).fillna("")
            for _, row in df.iterrows():
                name = str(row.get("name", "")).strip()
                if not name: continue
                db_dept = db.query(Department).filter(Department.name == name).first()
                if not db_dept:
                    db_dept = Department(name=name, description=str(row.get("description", "")))
                    db.add(db_dept)
            db.commit()
            logger.info("Departments seeded.")

        # 2. Faculty
        fac_path = os.path.join(base_dir, "faculty.csv")
        if os.path.exists(fac_path):
            df = pd.read_csv(fac_path).fillna("")
            for _, row in df.iterrows():
                email = str(row.get("email", "")).strip()
                if not email: continue
                
                dept_name = str(row.get("department", "")).strip()
                dept = db.query(Department).filter(Department.name == dept_name).first()
                if not dept and dept_name:
                    dept = Department(name=dept_name)
                    db.add(dept)
                    db.commit()
                
                db_fac = db.query(Faculty).filter(Faculty.email == email).first()
                if not db_fac:
                    db_fac = Faculty(email=email)
                    db.add(db_fac)
                
                db_fac.full_name = str(row.get("name", row.get("full_name", "")))
                db_fac.designation = str(row.get("role", row.get("designation", "")))
                db_fac.administrative_role = str(row.get("administrative_role", row.get("admin_role", "")))
                db_fac.department_id = dept.id if dept else None
                db_fac.phone = str(row.get("phone", ""))
                db_fac.office_room = str(row.get("office", ""))
                db_fac.office_hours = str(row.get("office_hours", ""))
                db_fac.qualification = str(row.get("qualification", ""))
                db_fac.specialization = str(row.get("specialization", ""))
                db_fac.image_url = str(row.get("avatar", row.get("image_url", "")))
            
            db.commit()
            
            # Now assign HOD to department
            for _, row in df.iterrows():
                desig = str(row.get("role", row.get("designation", ""))).lower()
                if "hod" in desig or "head" in desig:
                    email = str(row.get("email", "")).strip()
                    fac = db.query(Faculty).filter(Faculty.email == email).first()
                    if fac and fac.department_id:
                        dept = db.query(Department).filter(Department.id == fac.department_id).first()
                        if dept:
                            dept.hod_id = fac.id
            db.commit()
            
            logger.info("Faculty seeded and HODs assigned.")
            
        # 3. Events
        ev_path = os.path.join(base_dir, "events.csv")
        if os.path.exists(ev_path):
            df = pd.read_csv(ev_path).fillna("")
            for _, row in df.iterrows():
                title = str(row.get("event_name", row.get("title", ""))).strip()
                if not title: continue
                
                db_ev = db.query(Event).filter(Event.title == title).first()
                if not db_ev:
                    db_ev = Event(title=title)
                    db.add(db_ev)
                    
                db_ev.description = str(row.get("description", ""))
                db_ev.type = str(row.get("type", row.get("category", "")))
                db_ev.time = str(row.get("time", ""))
                db_ev.venue = str(row.get("venue", ""))
                db_ev.coordinator = str(row.get("coordinator", ""))
                db_ev.image_url = str(row.get("image_url", ""))
            db.commit()
            logger.info("Events seeded.")
            
        # 4. Clubs
        club_path = os.path.join(base_dir, "clubs.csv")
        if os.path.exists(club_path):
            df = pd.read_csv(club_path).fillna("")
            for _, row in df.iterrows():
                title = str(row.get("club_name", row.get("title", ""))).strip()
                if not title: continue
                
                db_club = db.query(Club).filter(Club.title == title).first()
                if not db_club:
                    db_club = Club(title=title)
                    db.add(db_club)
                    
                db_club.description = str(row.get("description", ""))
                db_club.category = str(row.get("category", ""))
                db_club.coordinator = str(row.get("coordinator", ""))
            db.commit()
            logger.info("Clubs seeded.")
            
        # 5. Notices (Announcements)
        notices_path = os.path.join(base_dir, "announcements.csv")
        if os.path.exists(notices_path):
            df = pd.read_csv(notices_path).fillna("")
            for _, row in df.iterrows():
                title = str(row.get("title", "")).strip()
                if not title: continue
                
                db_notice = db.query(Notice).filter(Notice.title == title).first()
                if not db_notice:
                    db_notice = Notice(title=title)
                    db.add(db_notice)
                    
                db_notice.content = str(row.get("content", ""))
                db_notice.type = str(row.get("type", ""))
                db_notice.author = str(row.get("author", ""))
            db.commit()
            logger.info("Notices seeded.")
            
        # 6. Buildings
        buildings_path = os.path.join(base_dir, "buildings.csv")
        if os.path.exists(buildings_path):
            df = pd.read_csv(buildings_path).fillna("")
            for _, row in df.iterrows():
                name = str(row.get("name", "")).strip()
                if not name: continue
                
                db_b = db.query(Building).filter(Building.name == name).first()
                if not db_b:
                    db_b = Building(name=name)
                    db.add(db_b)
                
                db_b.description = str(row.get("description", ""))
                db_b.code = str(row.get("code", ""))
                db_b.working_hours = str(row.get("working_hours", ""))
            db.commit()
            logger.info("Buildings seeded.")

    except Exception as e:
        logger.error(f"Seeding failed: {e}")
        db.rollback()
    finally:
        db.close()
        logger.info("Demo seeding completed.")

if __name__ == "__main__":
    seed_database()
