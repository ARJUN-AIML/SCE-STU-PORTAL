import os
import json
import csv
import random
import uuid
from datetime import datetime

DEPARTMENTS = ["CSE", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "BME"]
SECTIONS = ["A", "B"]
DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

PERIODS = [
    {"period": "1", "startTime": "08:45", "endTime": "09:35"},
    {"period": "2", "startTime": "09:35", "endTime": "10:25"},
    {"period": "3", "startTime": "10:45", "endTime": "11:35"},
    {"period": "4", "startTime": "11:35", "endTime": "12:25"},
    {"period": "5", "startTime": "13:15", "endTime": "14:05"},
    {"period": "6", "startTime": "14:05", "endTime": "14:55"},
    {"period": "7", "startTime": "14:55", "endTime": "15:45"},
]

# Hardcode some realistic subjects per department for odd semesters
SUBJECTS_MAP = {
    "CSE": {
        "1": [("HS3152", "Professional English - I", "3", "Lecture"), ("MA3151", "Matrices and Calculus", "4", "Lecture"), ("PH3151", "Engineering Physics", "3", "Lecture"), ("CY3151", "Engineering Chemistry", "3", "Lecture"), ("GE3151", "Problem Solving and Python Programming", "3", "Lecture"), ("GE3152", "Heritage of Tamils", "1", "Lecture"), ("GE3171", "Problem Solving and Python Programming Laboratory", "2", "Lab"), ("BS3171", "Physics and Chemistry Laboratory", "2", "Lab"), ("GE3172", "English Laboratory", "1", "Lab")],
        "3": [("CS3351", "Digital Principles and Computer Organization", "4", "Lecture"), ("CS3352", "Foundations of Data Science", "3", "Lecture"), ("CS3301", "Data Structures", "3", "Lecture"), ("CS3391", "Object Oriented Programming", "3", "Lecture"), ("CS3311", "Data Structures Laboratory", "2", "Lab")],
        "5": [("CS3591", "Computer Networks", "4", "Lecture"), ("CS3501", "Compiler Design", "4", "Lecture"), ("CB3491", "Cryptography and Cyber Security", "3", "Lecture"), ("CS3551", "Distributed Computing", "3", "Lecture"), ("CS3511", "Compiler Design Laboratory", "2", "Lab")],
        "7": [("CS3791", "Human Computer Interaction", "3", "Lecture"), ("CS3792", "Cloud Computing", "3", "Lecture"), ("GE3791", "Human Values and Ethics", "2", "Lecture"), ("CS3711", "Cloud Computing Laboratory", "2", "Lab"), ("CS3712", "Mini Project", "2", "Mini Project")]
    },
    "AIDS": {
        "1": [("HS3152", "Professional English - I", "3", "Lecture"), ("MA3151", "Matrices and Calculus", "4", "Lecture"), ("PH3151", "Engineering Physics", "3", "Lecture"), ("CY3151", "Engineering Chemistry", "3", "Lecture"), ("GE3151", "Problem Solving and Python Programming", "3", "Lecture"), ("GE3152", "Heritage of Tamils", "1", "Lecture"), ("GE3171", "Problem Solving and Python Programming Laboratory", "2", "Lab"), ("BS3171", "Physics and Chemistry Laboratory", "2", "Lab"), ("GE3172", "English Laboratory", "1", "Lab")],
        "3": [("AD3351", "Design and Analysis of Algorithms", "4", "Lecture"), ("AD3391", "Database Design and Management", "3", "Lecture"), ("AD3301", "Machine Learning", "4", "Lecture"), ("AD3352", "Operating Systems", "3", "Lecture"), ("AD3311", "Machine Learning Laboratory", "2", "Lab")],
        "5": [("AD3501", "Deep Learning", "4", "Lecture"), ("AD3502", "Natural Language Processing", "3", "Lecture"), ("AD3511", "Data Visualization", "3", "Lecture"), ("AD3512", "Cloud Computing", "3", "Lecture"), ("AD3511L", "Deep Learning Laboratory", "2", "Lab")],
        "7": [("AD3711", "Big Data Analytics", "3", "Lecture"), ("AD3712", "Recommender Systems", "3", "Lecture"), ("AD3791", "Ethics in Artificial Intelligence", "2", "Lecture"), ("AD3713", "Project Work", "2", "Mini Project"), ("AD3714", "Analytics Laboratory", "2", "Lab")]
    },
    "IT": {
        "1": [("HS3152", "Professional English - I", "3", "Lecture"), ("MA3151", "Matrices and Calculus", "4", "Lecture"), ("PH3151", "Engineering Physics", "3", "Lecture"), ("CY3151", "Engineering Chemistry", "3", "Lecture"), ("GE3151", "Problem Solving and Python Programming", "3", "Lecture"), ("GE3152", "Heritage of Tamils", "1", "Lecture"), ("GE3171", "Problem Solving and Python Programming Laboratory", "2", "Lab"), ("BS3171", "Physics and Chemistry Laboratory", "2", "Lab"), ("GE3172", "English Laboratory", "1", "Lab")],
        "3": [("IT3301", "Data Structures", "3", "Lecture"), ("IT3351", "Web Essentials", "3", "Lecture"), ("IT3302", "Computer Organization", "3", "Lecture"), ("IT3352", "Object Oriented Programming", "3", "Lecture"), ("IT3311", "Data Structures Laboratory", "2", "Lab")],
        "5": [("IT3501", "Web Technology", "3", "Lecture"), ("IT3502", "Service Oriented Architecture", "3", "Lecture"), ("IT3551", "Computer Networks", "4", "Lecture"), ("IT3503", "Software Testing", "3", "Lecture"), ("IT3511", "Web Technology Laboratory", "2", "Lab")],
        "7": [("IT3701", "Cloud Computing", "3", "Lecture"), ("IT3702", "Cyber Security", "3", "Lecture"), ("IT3791", "Human Values and Ethics", "2", "Lecture"), ("IT3711", "Project Work", "2", "Mini Project"), ("IT3712", "Cloud Laboratory", "2", "Lab")]
    },
    "ECE": {
        "1": [("HS3152", "Professional English - I", "3", "Lecture"), ("MA3151", "Matrices and Calculus", "4", "Lecture"), ("PH3151", "Engineering Physics", "3", "Lecture"), ("CY3151", "Engineering Chemistry", "3", "Lecture"), ("EC3151", "Basic Electrical and Electronics Engineering", "3", "Lecture"), ("GE3152", "Heritage of Tamils", "1", "Lecture"), ("GE3171", "Programming Laboratory", "2", "Lab"), ("BS3171", "Physics and Chemistry Laboratory", "2", "Lab"), ("GE3172", "English Laboratory", "1", "Lab")],
        "3": [("EC3351", "Control Systems", "4", "Lecture"), ("EC3352", "Signals and Systems", "4", "Lecture"), ("EC3301", "Electromagnetic Fields", "3", "Lecture"), ("EC3353", "Digital Signal Processing", "3", "Lecture"), ("EC3311", "Signals Laboratory", "2", "Lab")],
        "5": [("EC3501", "Wireless Communication", "4", "Lecture"), ("EC3502", "VLSI Design", "3", "Lecture"), ("EC3551", "Embedded Systems", "3", "Lecture"), ("EC3552", "Antenna and Wave Propagation", "3", "Lecture"), ("EC3511", "Embedded Systems Laboratory", "2", "Lab")],
        "7": [("EC3701", "Optical Communication", "3", "Lecture"), ("EC3702", "RF and Microwave Engineering", "3", "Lecture"), ("EC3791", "Professional Ethics", "2", "Lecture"), ("EC3711", "Project Work", "2", "Mini Project"), ("EC3712", "VLSI Laboratory", "2", "Lab")]
    },
    "EEE": {
        "1": [("HS3152", "Professional English - I", "3", "Lecture"), ("MA3151", "Matrices and Calculus", "4", "Lecture"), ("PH3151", "Engineering Physics", "3", "Lecture"), ("CY3151", "Engineering Chemistry", "3", "Lecture"), ("BE3151", "Basic Electrical and Electronics Engineering", "3", "Lecture"), ("GE3152", "Heritage of Tamils", "1", "Lecture"), ("GE3171", "Programming Laboratory", "2", "Lab"), ("BS3171", "Physics and Chemistry Laboratory", "2", "Lab"), ("GE3172", "English Laboratory", "1", "Lab")],
        "3": [("EE3301", "Power Systems I", "4", "Lecture"), ("EE3302", "Electrical Machines I", "4", "Lecture"), ("EE3303", "Electromagnetic Fields", "3", "Lecture"), ("EE3304", "Digital Logic Circuits", "3", "Lecture"), ("EE3311", "Electrical Machines Laboratory", "2", "Lab")],
        "5": [("EE3501", "Power Electronics", "3", "Lecture"), ("EE3502", "Protection and Switchgear", "3", "Lecture"), ("EE3551", "Renewable Energy Systems", "3", "Lecture"), ("EE3503", "Microprocessors and Microcontrollers", "4", "Lecture"), ("EE3511", "Power Electronics Laboratory", "2", "Lab")],
        "7": [("EE3701", "Power System Operation and Control", "3", "Lecture"), ("EE3702", "High Voltage Engineering", "3", "Lecture"), ("EE3791", "Energy Management", "2", "Lecture"), ("EE3711", "Project Work", "2", "Mini Project"), ("EE3712", "Power System Simulation Laboratory", "2", "Lab")]
    },
    "MECH": {
        "1": [("HS3152", "Professional English - I", "3", "Lecture"), ("MA3151", "Matrices and Calculus", "4", "Lecture"), ("PH3151", "Engineering Physics", "3", "Lecture"), ("CY3151", "Engineering Chemistry", "3", "Lecture"), ("GE3151", "Problem Solving and Python Programming", "3", "Lecture"), ("GE3152", "Heritage of Tamils", "1", "Lecture"), ("GE3171", "Programming Laboratory", "2", "Lab"), ("BS3171", "Physics and Chemistry Laboratory", "2", "Lab"), ("GE3172", "English Laboratory", "1", "Lab")],
        "3": [("ME3351", "Engineering Thermodynamics", "4", "Lecture"), ("ME3352", "Manufacturing Technology I", "4", "Lecture"), ("ME3301", "Fluid Mechanics and Machinery", "3", "Lecture"), ("ME3302", "Theory of Machines", "3", "Lecture"), ("ME3311", "Manufacturing Technology Laboratory", "2", "Lab")],
        "5": [("ME3501", "Design of Machine Elements", "4", "Lecture"), ("ME3502", "Heat and Mass Transfer", "4", "Lecture"), ("ME3551", "Finite Element Analysis", "3", "Lecture"), ("ME3503", "Metrology and Measurements", "3", "Lecture"), ("ME3511", "CAD/CAM Laboratory", "2", "Lab")],
        "7": [("ME3701", "Robotics and Automation", "3", "Lecture"), ("ME3702", "Refrigeration and Air Conditioning", "3", "Lecture"), ("ME3791", "Industrial Engineering", "2", "Lecture"), ("ME3711", "Project Work", "2", "Mini Project"), ("ME3712", "Automation Laboratory", "2", "Lab")]
    },
    "CIVIL": {
        "1": [("HS3152", "Professional English - I", "3", "Lecture"), ("MA3151", "Matrices and Calculus", "4", "Lecture"), ("PH3151", "Engineering Physics", "3", "Lecture"), ("CY3151", "Engineering Chemistry", "3", "Lecture"), ("GE3151", "Problem Solving and Python Programming", "3", "Lecture"), ("GE3152", "Heritage of Tamils", "1", "Lecture"), ("GE3171", "Programming Laboratory", "2", "Lab"), ("BS3171", "Physics and Chemistry Laboratory", "2", "Lab"), ("GE3172", "English Laboratory", "1", "Lab")],
        "3": [("CE3351", "Strength of Materials I", "4", "Lecture"), ("CE3352", "Construction Materials", "3", "Lecture"), ("CE3301", "Fluid Mechanics", "4", "Lecture"), ("CE3302", "Surveying", "3", "Lecture"), ("CE3311", "Surveying Laboratory", "2", "Lab")],
        "5": [("CE3501", "Structural Analysis II", "4", "Lecture"), ("CE3502", "Design of Reinforced Concrete Elements", "4", "Lecture"), ("CE3551", "Environmental Engineering", "3", "Lecture"), ("CE3503", "Transportation Engineering", "3", "Lecture"), ("CE3511", "Environmental Engineering Laboratory", "2", "Lab")],
        "7": [("CE3701", "Estimation and Costing", "3", "Lecture"), ("CE3702", "Earthquake Engineering", "3", "Lecture"), ("CE3791", "Construction Management", "2", "Lecture"), ("CE3711", "Project Work", "2", "Mini Project"), ("CE3712", "Civil Engineering Laboratory", "2", "Lab")]
    },
    "BME": {
        "1": [("HS3152", "Professional English - I", "3", "Lecture"), ("MA3151", "Matrices and Calculus", "4", "Lecture"), ("PH3151", "Engineering Physics", "3", "Lecture"), ("CY3151", "Engineering Chemistry", "3", "Lecture"), ("GE3151", "Problem Solving and Python Programming", "3", "Lecture"), ("GE3152", "Heritage of Tamils", "1", "Lecture"), ("GE3171", "Programming Laboratory", "2", "Lab"), ("BS3171", "Physics and Chemistry Laboratory", "2", "Lab"), ("GE3172", "English Laboratory", "1", "Lab")],
        "3": [("BM3351", "Signals and Systems", "4", "Lecture"), ("BM3352", "Anatomy and Human Physiology", "3", "Lecture"), ("BM3301", "Biomedical Instrumentation", "4", "Lecture"), ("BM3302", "Biochemistry", "3", "Lecture"), ("BM3311", "Biomedical Instrumentation Laboratory", "2", "Lab")],
        "5": [("BM3501", "Medical Imaging Systems", "4", "Lecture"), ("BM3502", "Biomaterials", "3", "Lecture"), ("BM3551", "Rehabilitation Engineering", "3", "Lecture"), ("BM3503", "Clinical Engineering", "3", "Lecture"), ("BM3511", "Medical Imaging Laboratory", "2", "Lab")],
        "7": [("BM3701", "Artificial Organs", "3", "Lecture"), ("BM3702", "Biosensors", "3", "Lecture"), ("BM3791", "Healthcare Ethics", "2", "Lecture"), ("BM3711", "Project Work", "2", "Mini Project"), ("BM3712", "Biomedical Signal Processing Laboratory", "2", "Lab")]
    },
}

FACULTY_FIRST_NAMES = ["Dr. R.", "Dr. S.", "Dr. K.", "Dr. M.", "Dr. P.", "Prof. A.", "Prof. V.", "Prof. G."]
FACULTY_LAST_NAMES = ["Kumar", "Krishnan", "Rajan", "Natarajan", "Sundaram", "Karthik", "Ramesh", "Balaji", "Srinivasan", "Venkatesh"]

def generate_faculty():
    return f"{random.choice(FACULTY_FIRST_NAMES)} {random.choice(FACULTY_LAST_NAMES)}"

def get_subjects(dept, sem):
    if dept in SUBJECTS_MAP and sem in SUBJECTS_MAP[dept]:
        return SUBJECTS_MAP[dept][sem]
    else:
        return [
            (f"{dept}{sem}01", f"Core Subject 1 {dept}", "4", "Lecture"),
            (f"{dept}{sem}02", f"Core Subject 2 {dept}", "3", "Lecture"),
            (f"{dept}{sem}03", f"Core Subject 3 {dept}", "3", "Lecture"),
            (f"{dept}{sem}04", f"Core Subject 4 {dept}", "3", "Lecture"),
            (f"{dept}{sem}11", f"Practical Lab 1 {dept}", "2", "Lab"),
        ]

def generate_timetable():
    backend_dir = os.path.join("backend", "data", "timetables")
    csv_dir = "Dataset_for_chatbot"
    
    os.makedirs(backend_dir, exist_ok=True)
    os.makedirs(csv_dir, exist_ok=True)
    
    all_entries = []
    
    version = "1.2"
    last_updated = datetime.utcnow().isoformat() + "Z"
    academic_year = "2026-2027"
    regulation = "2021"
    
    for dept in DEPARTMENTS:
        dept_dir = os.path.join(backend_dir, dept)
        os.makedirs(dept_dir, exist_ok=True)
        
        for year in ["1", "2", "3", "4"]:
            year_dir = os.path.join(dept_dir, f"Year{year}")
            os.makedirs(year_dir, exist_ok=True)
            
            sem = str(int(year) * 2 - 1) # 1, 3, 5, 7
            sem_dir = os.path.join(year_dir, f"Semester{sem}")
            os.makedirs(sem_dir, exist_ok=True)
            
            subjects = get_subjects(dept, sem)
            
            for section in SECTIONS:
                json_path = os.path.join(sem_dir, f"Section{section}.json")
                section_entries = []
                
                # Assign faculty to subjects for this section
                faculty_map = {sub[0]: generate_faculty() for sub in subjects}
                
                for day in DAYS:
                    # Allocate periods
                    p_idx = 0
                    while p_idx < len(PERIODS):
                        p = PERIODS[p_idx]
                        
                        # Decide if Lab (3 periods) or Lecture
                        lab_days = ["Tuesday", "Thursday", "Saturday"]
                        is_lab_day = day in lab_days and p_idx >= 4
                        
                        if is_lab_day and p_idx == 4:
                            # 3 period Lab
                            lab_subjects = [s for s in subjects if s[3] == "Lab"]
                            lab_day_index = lab_days.index(day)
                            lab_sub = lab_subjects[lab_day_index % len(lab_subjects)] if lab_subjects else subjects[-1]
                            room = f"Lab-{random.randint(1, 10)}"
                            building = "IT Block" if dept in ["CSE", "IT", "AIDS"] else "Main Block"
                            
                            for lab_p_idx in range(4, 7):
                                lab_p = PERIODS[lab_p_idx]
                                entry = {
                                    "id": str(uuid.uuid4()),
                                    "department": dept,
                                    "regulation": regulation,
                                    "academicYear": academic_year,
                                    "version": version,
                                    "lastUpdated": last_updated,
                                    "year": year,
                                    "semester": sem,
                                    "section": section,
                                    "day": day,
                                    "period": lab_p["period"],
                                    "startTime": lab_p["startTime"],
                                    "endTime": lab_p["endTime"],
                                    "subjectName": lab_sub[1],
                                    "subjectCode": lab_sub[0],
                                    "faculty": faculty_map[lab_sub[0]],
                                    "room": room,
                                    "building": building,
                                    "credits": lab_sub[2],
                                    "classType": "Lab",
                                    "laboratory": room,
                                    "elective": "",
                                    "batch": "All",
                                    "remarks": ""
                                }
                                section_entries.append(entry)
                                all_entries.append(entry)
                            p_idx = 7
                        else:
                            # Lecture
                            lec_sub = random.choice([s for s in subjects if s[3] != "Lab"])
                            room = f"C{random.randint(101, 405)}"
                            building = "IT Block" if dept in ["CSE", "IT", "AIDS"] else "Main Block"
                            
                            entry = {
                                "id": str(uuid.uuid4()),
                                "department": dept,
                                "regulation": regulation,
                                "academicYear": academic_year,
                                "version": version,
                                "lastUpdated": last_updated,
                                "year": year,
                                "semester": sem,
                                "section": section,
                                "day": day,
                                "period": p["period"],
                                "startTime": p["startTime"],
                                "endTime": p["endTime"],
                                "subjectName": lec_sub[1],
                                "subjectCode": lec_sub[0],
                                "faculty": faculty_map[lec_sub[0]],
                                "room": room,
                                "building": building,
                                "credits": lec_sub[2],
                                "classType": lec_sub[3],
                                "laboratory": "",
                                "elective": "",
                                "batch": "All",
                                "remarks": ""
                            }
                            section_entries.append(entry)
                            all_entries.append(entry)
                            p_idx += 1

                with open(json_path, 'w', encoding='utf-8') as f:
                    json.dump(section_entries, f, indent=2)

    # Export CSV for RAG
    csv_path = os.path.join(csv_dir, "timetable.csv")
    if all_entries:
        keys = list(all_entries[0].keys())
        with open(csv_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.DictWriter(f, fieldnames=keys)
            writer.writeheader()
            writer.writerows(all_entries)

    # Keep the frontend demo dataset in sync with the backend timetable data.
    frontend_path = os.path.join("frontend", "src", "repositories", "timetable-dataset.json")
    with open(frontend_path, 'w', encoding='utf-8') as f:
        json.dump(all_entries, f, indent=2, ensure_ascii=False)

    print(f"Generated datasets for {len(DEPARTMENTS)} departments.")
    print(f"Total entries: {len(all_entries)}")
    print(f"CSV exported to {csv_path}")

if __name__ == "__main__":
    generate_timetable()
