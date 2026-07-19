from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, JSON, Text, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from database.config import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    firebase_uid = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String)
    role = Column(String, default="student") # guest, student, faculty, admin
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    uploads = relationship("UploadedFile", back_populates="user")

class Department(Base):
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(Text)
    hod_id = Column(Integer, ForeignKey("faculty.id", use_alter=True, name="fk_dept_hod"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    faculty = relationship("Faculty", back_populates="department", foreign_keys="[Faculty.department_id]")
    hod = relationship("Faculty", foreign_keys=[hod_id], post_update=True)

class Faculty(Base):
    __tablename__ = "faculty"
    
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, index=True, nullable=False)
    designation = Column(String) 
    administrative_role = Column(String) # e.g. "Principal", "Dean"
    email = Column(String, index=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    qualification = Column(String)
    specialization = Column(String)
    office_room = Column(String)
    image_url = Column(String)
    
    # Keeping old fields for backwards compatibility with other modules if any
    phone = Column(String)
    office_hours = Column(String)
    expertise = Column(JSON) 
    status = Column(String, default="available") 
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    department = relationship("Department", back_populates="faculty", foreign_keys=[department_id])

class Event(Base):
    __tablename__ = "events"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    type = Column(String) # technical, cultural, workshop
    thumbnail = Column(String)
    date = Column(DateTime(timezone=True))
    time = Column(String)
    venue = Column(String)
    coordinator = Column(String)
    seats_total = Column(Integer, default=0)
    seats_filled = Column(Integer, default=0)
    is_recommended = Column(Boolean, default=False)
    status = Column(String, default="open") # open, closed, past
    
    # AI Cover Image fields
    image_url = Column(String)
    image_public_id = Column(String)
    image_generation_status = Column(String, default="Pending") # Pending, Processing, Completed, Failed
    image_prompt = Column(Text)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Club(Base):
    __tablename__ = "clubs"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    category = Column(String) # technical, arts, sports
    thumbnail = Column(String)
    coordinator = Column(String)
    status = Column(String, default="open") # open, closed
    is_recommended = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Notice(Base):
    __tablename__ = "notices"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    content = Column(Text)
    type = Column(String) # placement, academic, general
    category = Column(String)
    priority = Column(String, default="low") # low, medium, high
    author = Column(String)
    publish_date = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Resource(Base):
    __tablename__ = "resources"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text)
    type = Column(String) # syllabus, previous_year_paper, notes
    category = Column(String)
    url = Column(String, nullable=False)
    size = Column(String)
    uploaded_by = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TimetableEntry(Base):
    __tablename__ = "timetable"
    
    id = Column(Integer, primary_key=True, index=True)
    course_code = Column(String, index=True)
    course_name = Column(String)
    department_id = Column(Integer, ForeignKey("departments.id"))
    semester = Column(Integer)
    section = Column(String)
    day_of_week = Column(String) # Monday, Tuesday...
    start_time = Column(String)
    end_time = Column(String)
    room = Column(String)
    faculty_id = Column(Integer, ForeignKey("faculty.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TransportRoute(Base):
    __tablename__ = "transport"
    
    id = Column(Integer, primary_key=True, index=True)
    bus_id = Column(String, index=True, nullable=False)
    route_name = Column(String)
    from_stop = Column(String)
    to_stop = Column(String)
    final_destination = Column(String)
    vehicle_type = Column(String)
    stops = Column(JSON) # List of strings
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class LibraryBook(Base):
    __tablename__ = "library"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    author = Column(String)
    isbn = Column(String, index=True)
    category = Column(String)
    cover_image = Column(String)
    total_copies = Column(Integer, default=1)
    available_copies = Column(Integer, default=1)
    status = Column(String, default="available") # available, reserved
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Building(Base):
    __tablename__ = "buildings"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(Text)
    code = Column(String, index=True) # e.g. "BLK-B"
    coordinates = Column(JSON) # {x, y} for map
    working_hours = Column(String)
    nearby_facilities = Column(JSON) # List of strings
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Registration(Base):
    __tablename__ = "registrations"
    
    id = Column(Integer, primary_key=True, index=True)
    student_uid = Column(String, index=True, nullable=False)
    event_id = Column(String, index=True, nullable=False)
    event_title = Column(String)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    roll_number = Column(String, nullable=False)
    notes = Column(Text)
    registration_status = Column(String, default="Registered")
    registered_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    __table_args__ = (
        UniqueConstraint('student_uid', 'event_id', name='uq_student_event'),
    )

class UploadedFile(Base):
    __tablename__ = "uploaded_files"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    filename = Column(String, nullable=False)
    url = Column(String, nullable=False) # Cloudinary URL
    format = Column(String)
    indexed = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    user = relationship("User", back_populates="uploads")

class ChatHistory(Base):
    __tablename__ = "chat_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String, index=True)
    role = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class DocumentMetadata(Base):
    __tablename__ = "document_metadata"
    
    id = Column(Integer, primary_key=True, index=True)
    document_name = Column(String, index=True, nullable=False)
    uploaded_by = Column(String, default="system")
    upload_time = Column(DateTime(timezone=True), server_default=func.now())
    file_type = Column(String)
    ocr_used = Column(Boolean, default=False)
    pages = Column(Integer, default=0)
    chunks = Column(Integer, default=0)
    embedding_status = Column(String, default="pending")
    last_indexed = Column(DateTime(timezone=True))
    vector_collection = Column(String, default="default")

class ClubRegistration(Base):
    """
    SQL Equivalent:
    CREATE TABLE club_registrations (
        id SERIAL PRIMARY KEY,
        student_name VARCHAR NOT NULL,
        batch_no VARCHAR NOT NULL,
        department VARCHAR NOT NULL,
        year VARCHAR NOT NULL,
        mobile_number VARCHAR NOT NULL,
        college_email VARCHAR NOT NULL,
        club_name VARCHAR NOT NULL,
        status VARCHAR DEFAULT 'Pending',
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
    """
    __tablename__ = "club_registrations"
    
    id = Column(Integer, primary_key=True, index=True)
    student_name = Column(String, nullable=False)
    batch_no = Column(String, nullable=False)
    department = Column(String, nullable=False)
    year = Column(String, nullable=False)
    mobile_number = Column(String, nullable=False)
    college_email = Column(String, nullable=False)
    club_name = Column(String, index=True, nullable=False)
    status = Column(String, default="Pending") # Pending, Approved, Rejected
    applied_at = Column(DateTime(timezone=True), server_default=func.now())
