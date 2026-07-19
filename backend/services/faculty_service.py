from sqlalchemy.orm import Session
from sqlalchemy import or_
from models.models import Faculty, Department

def get_faculty_info_from_db(db: Session, query: str = None, department_filter: str = None):
    """
    Fetches faculty information directly from PostgreSQL.
    Returns a formatted string that can be injected into the LLM context.
    """
    db_query = db.query(Faculty).join(Department, Faculty.department_id == Department.id, isouter=True)
    
    if department_filter:
        db_query = db_query.filter(
            or_(
                Department.name.ilike(f"%{department_filter}%"),
                Department.code.ilike(f"%{department_filter}%")
            )
        )
        
    faculty_list = db_query.all()
    
    if not faculty_list:
        return "No faculty records found in the database."
        
    # Group by department
    dept_map = {}
    for f in faculty_list:
        dept_name = f.department.name if f.department else "General"
        if dept_name not in dept_map:
            dept_map[dept_name] = []
        dept_map[dept_name].append(f)
        
    output = "===== FACULTY DATABASE RECORDS =====\n"
    for dept, members in dept_map.items():
        output += f"\nDepartment: {dept}\n"
        
        # Sort by HOD, then Professors, then others
        def sort_key(f: Faculty):
            role_prio = 5
            desig = (f.designation or "").lower()
            admin = (f.administrative_role or "").lower()
            if "hod" in admin or "hod" in desig or "head" in admin or "head" in desig:
                role_prio = 1
            elif "professor" in desig and "associate" not in desig and "assistant" not in desig:
                role_prio = 2
            elif "associate professor" in desig:
                role_prio = 3
            elif "assistant professor" in desig:
                role_prio = 4
            return (role_prio, f.full_name)
            
        members.sort(key=sort_key)
        
        for f in members:
            admin_role = f" ({f.administrative_role})" if f.administrative_role else ""
            output += f"- Name: {f.full_name}\n"
            output += f"  Designation: {f.designation}{admin_role}\n"
            output += f"  Email: {f.email}\n"
            if f.office_room: output += f"  Office: {f.office_room}\n"
            if f.qualification: output += f"  Qualification: {f.qualification}\n"
            if f.specialization: output += f"  Specialization: {f.specialization}\n"
            output += "\n"
            
    return output
