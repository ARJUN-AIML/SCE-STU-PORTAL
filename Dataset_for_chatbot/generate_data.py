"""
generate_data.py
Freshers Portal RAG Dataset — Hackathon Demo Generator
Generates all CSV files for the SCE Student Portal AI Chatbot demo.
Run: python generate_data.py
"""

import csv
import os
import random
from datetime import date, timedelta

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

BASE = os.path.dirname(os.path.abspath(__file__))

def mkdir(path):
    os.makedirs(path, exist_ok=True)

def csv_path(subdir, filename):
    d = os.path.join(BASE, subdir)
    mkdir(d)
    return os.path.join(d, filename)

def write_csv(subdir, filename, headers, rows):
    path = csv_path(subdir, filename)
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(headers)
        w.writerows(rows)
    print(f"  [OK] {subdir}/{filename}  ({len(rows)} rows)")

def d(offset_days=0):
    return (date(2026, 7, 17) + timedelta(days=offset_days)).isoformat()

# ---------------------------------------------------------------------------
# ============================================================
# CORE
# ============================================================

def gen_buildings():
    rows = [
        ["B01","RV Block","academic_block",4,"08:00-18:00","ramp_and_lift","Main Entrance Gate","RV Block is the main academic and administrative building of the campus. It houses the Principal Office, Administrative Office, first-year CSE classrooms, the Exam Cell, Placement Cell, Accounts Office, Library, Medical Room, and several student support services. It is the first building visible from the main gate and serves as the central hub for all campus administrative activities."],
        ["B02","KS Block","academic_block",4,"08:00-18:00","ramp","Near RV Block","KS Block is the core engineering block housing the ECE, EEE, ICE, and IT departments. It contains electronics and electrical laboratories, seminar halls, and faculty cabins for all four departments. Located east of RV Block, it is the go-to building for engineering students in their second year onwards."],
        ["B03","BD Block","academic_block",4,"08:00-18:00","ramp","Central Pathway","BD Block, also known as JS-CH Block, houses the AIML, AIDS, CSBS, and Civil Engineering departments. It is the newest academic block and features modern smart classrooms, AI labs, data science labs, and design studios. Located centrally between RV Block and the sports ground."],
        ["B04","ME Block","academic_block",4,"08:00-18:00","stairs_only","Near ME Workshop","ME Block houses the Mechanical Engineering department. It contains thermodynamics labs, fluid mechanics labs, CAD labs, faculty offices, and seminar halls. Adjacent to the ME Workshop and situated at the far end of the campus."],
        ["B05","ME Workshop","workshop",1,"08:00-17:00","ramp","Behind ME Block","The ME Workshop is a large ground-level workshop building used for mechanical fabrication, welding, lathe practice, and college symposiums. It is regularly used for inter-departmental technical fests and cultural events due to its large open floor area."],
        ["B06","Main Gate","gate",0,"24x7","ramp","Campus Entrance","The Main Gate is the primary entry point to the campus. The security cabin, visitor registration desk, and bicycle parking are located here. All college buses arrive and depart from the main gate area."],
        ["B07","Sports Ground","ground",0,"06:00-20:00","ramp","Behind BD Block","The Sports Ground is a large open area behind BD Block used for cricket, football, athletics, and the annual Sports Meet. The ground also hosts open-air events and cultural performances during college fests."],
        ["B08","Canteen Block","facility_area",1,"08:00-16:30","ramp","Near RV Block","The Canteen Block houses the Central Canteen, which serves breakfast, lunch, and evening snacks to students and faculty. Located adjacent to RV Block for easy access between classes."],
        ["B09","Hostel Complex","facility_area",3,"24x7","ramp","North Campus","The Hostel Complex is located on the north side of campus and houses separate hostel blocks for male and female students. It includes mess facilities, common rooms, reading rooms, and warden offices."],
    ]
    write_csv("core", "buildings.csv",
        ["building_id","building_name","location_type","floor_count","operating_hours","accessibility","landmark","description"],
        rows)
    return {r[0] for r in rows}

def gen_departments():
    rows = [
        ["D01","CSE","Computer Science and Engineering","B01","F001","cse@sce.edu","+91-9876540001","The CSE department offers undergraduate programs in Computer Science and Engineering. It is housed in RV Block and focuses on programming, algorithms, software engineering, databases, and emerging technologies. CSE is one of the largest and most sought-after departments on campus."],
        ["D02","AIML","Artificial Intelligence and Machine Learning","B03","F005","aiml@sce.edu","+91-9876540002","The AIML department specializes in Artificial Intelligence, Machine Learning, Deep Learning, and Data Analytics. Located in BD Block, it features state-of-the-art AI labs and is one of the newest departments on campus, introduced to meet industry demand for AI professionals."],
        ["D03","AIDS","Artificial Intelligence and Data Science","B03","F008","aids@sce.edu","+91-9876540003","The AIDS department focuses on Data Science, Big Data Analytics, and AI-driven decision-making. It shares BD Block with AIML and offers hands-on exposure to data engineering tools, Python, R, and cloud platforms."],
        ["D04","CSBS","Computer Science and Business Systems","B03","F010","csbs@sce.edu","+91-9876540004","The CSBS department combines computer science with business and management education. Students gain skills in programming, ERP systems, business analytics, and entrepreneurship. Located in BD Block."],
        ["D05","CIVIL","Civil Engineering","B03","F012","civil@sce.edu","+91-9876540005","The Civil Engineering department covers structural engineering, environmental engineering, transportation, and construction management. Housed in BD Block with access to soil testing and material testing labs."],
        ["D06","ECE","Electronics and Communication Engineering","B02","F014","ece@sce.edu","+91-9876540006","The ECE department covers electronics, communication systems, VLSI design, embedded systems, and signal processing. Located in KS Block with fully equipped electronics and communication labs."],
        ["D07","EEE","Electrical and Electronics Engineering","B02","F017","eee@sce.edu","+91-9876540007","The EEE department covers electrical machines, power systems, control systems, and power electronics. Located in KS Block with electrical machines labs and high-voltage testing facilities."],
        ["D08","ICE","Instrumentation and Control Engineering","B02","F019","ice@sce.edu","+91-9876540008","The ICE department, also known as Instrumentation and Control Engineering, covers process control, sensors, PLCs, SCADA systems, and industrial automation. Located in KS Block."],
        ["D09","IT","Information Technology","B02","F021","it@sce.edu","+91-9876540009","The IT department focuses on networking, web development, cloud computing, cybersecurity, and information systems management. Located in KS Block with dedicated IT labs and server rooms."],
        ["D10","MECH","Mechanical Engineering","B04","F023","mech@sce.edu","+91-9876540010","The Mechanical Engineering department covers thermodynamics, fluid mechanics, manufacturing, CAD/CAM, and industrial engineering. Located in ME Block with access to the ME Workshop for hands-on practice."],
    ]
    write_csv("core", "departments.csv",
        ["department_id","department_code","department_name","building_id","hod_faculty_id","email","phone","description"],
        rows)
    return {r[0] for r in rows}

def gen_equipment():
    rows = [
        ["EQ01","Projector","av_equipment"],
        ["EQ02","Smart Board","av_equipment"],
        ["EQ03","Air Conditioner","climate"],
        ["EQ04","Desktop PC","computing"],
        ["EQ05","Oscilloscope","lab_instrument"],
        ["EQ06","Function Generator","lab_instrument"],
        ["EQ07","Multimeter","lab_instrument"],
        ["EQ08","Soldering Station","lab_instrument"],
        ["EQ09","3D Printer","lab_instrument"],
        ["EQ10","CNC Machine","lab_instrument"],
        ["EQ11","Lathe Machine","lab_instrument"],
        ["EQ12","Welding Equipment","lab_instrument"],
        ["EQ13","Whiteboard","furniture"],
        ["EQ14","PA System","av_equipment"],
        ["EQ15","Server Rack","computing"],
    ]
    write_csv("reference", "equipment.csv",
        ["equipment_id","equipment_name","category"],
        rows)
    return {r[0] for r in rows}

def gen_rooms():
    rows = []
    rid = 1

    def add(bid, rnum, floor, cap, rtype, dept_id, desc):
        nonlocal rid
        rows.append([f"R{rid:03d}", bid, rnum, floor, cap, rtype, dept_id, desc])
        r = f"R{rid:03d}"
        rid += 1
        return r

    # RV Block (B01) rooms
    add("B01","RV-GF-Principal",0,5,"office","D01","Principal's Office located on the ground floor of RV Block. Houses the Principal and administrative support staff.")
    add("B01","RV-GF-Admin",0,10,"office","D01","Administrative Office on the ground floor of RV Block. Handles student records, correspondence, and general administration.")
    add("B01","RV-GF-Accounts",0,8,"office","D01","Accounts Office on the ground floor of RV Block. Handles fee payment, receipts, and financial transactions.")
    add("B01","RV-GF-Admission",0,6,"office","D01","Admission Cell on the ground floor of RV Block. Handles new student admissions, document verification, and enrollment.")
    add("B01","RV-GF-Transport",0,4,"office","D01","Transport Office on the ground floor of RV Block. Manages bus pass applications and college transport scheduling.")
    add("B01","RV-GF-Medical",0,4,"office","D01","Medical Room on the ground floor of RV Block. First-aid and basic medical care provided by the campus nurse.")
    add("B01","RV-GF-Security",0,3,"office","D01","Security Office at the ground floor of RV Block near the entrance. Manages campus security and visitor passes.")
    add("B01","RV-1F-ExamCell",1,8,"office","D01","Exam Cell on the first floor of RV Block. Handles exam scheduling, hall ticket distribution, results, and arrear management.")
    add("B01","RV-1F-Placement",1,10,"office","D01","Placement Cell on the first floor of RV Block. Coordinates campus recruitment drives, internships, and career guidance.")
    add("B01","RV-1F-Library",1,80,"office","D01","Central Library on the first floor of RV Block. Houses a collection of over 10,000 books, journals, and digital resources available to all students and faculty.")
    add("B01","RV-301",3,60,"classroom","D01","CSE Classroom on the third floor of RV Block. Equipped with projector and whiteboard. Used primarily for first-year CSE theory classes.")
    add("B01","RV-302",3,60,"classroom","D01","CSE Classroom on the third floor of RV Block. Used for first-year theory classes.")
    add("B01","RV-303",3,60,"classroom","D01","CSE Classroom on the third floor of RV Block.")
    add("B01","RV-304",3,60,"classroom","D01","CSE Classroom on the third floor of RV Block.")
    add("B01","RV-305",3,60,"classroom","D01","CSE Classroom on the third floor of RV Block.")
    add("B01","RV-401",4,60,"classroom","D01","CSE Classroom on the fourth floor of RV Block.")
    add("B01","RV-402",4,60,"classroom","D01","CSE Classroom on the fourth floor of RV Block.")
    add("B01","RV-403",4,60,"classroom","D01","CSE Classroom on the fourth floor of RV Block.")
    add("B01","RV-Lab1",2,40,"laboratory","D01","Computer Lab 1 on the second floor of RV Block. Contains 40 desktop PCs used for programming and software labs.")
    add("B01","RV-Lab2",2,40,"laboratory","D01","Computer Lab 2 on the second floor of RV Block. Used for DBMS, operating systems, and web development labs.")
    add("B01","RV-SH1",1,150,"seminar_hall","D01","Seminar Hall 1 on the first floor of RV Block. Large air-conditioned hall used for orientation, guest lectures, and workshops.")

    # KS Block (B02) rooms
    add("B02","KS-301",3,60,"classroom","D06","ECE Classroom on the third floor of KS Block.")
    add("B02","KS-302",3,60,"classroom","D06","ECE Classroom on the third floor of KS Block.")
    add("B02","KS-303",3,60,"classroom","D06","ECE Classroom on the third floor of KS Block.")
    add("B02","KS-304",3,60,"classroom","D07","EEE Classroom on the third floor of KS Block.")
    add("B02","KS-305",3,60,"classroom","D07","EEE Classroom on the third floor of KS Block.")
    add("B02","KS-401",4,60,"classroom","D08","ICE Classroom on the fourth floor of KS Block.")
    add("B02","KS-402",4,60,"classroom","D09","IT Classroom on the fourth floor of KS Block.")
    add("B02","KS-403",4,60,"classroom","D09","IT Classroom on the fourth floor of KS Block.")
    add("B02","KS-ECE-Lab",2,40,"laboratory","D06","Electronics and Communication Lab on the second floor of KS Block. Equipped with oscilloscopes, function generators, and breadboard kits.")
    add("B02","KS-EEE-Lab",2,40,"laboratory","D07","Electrical Machines Lab on the second floor of KS Block. Contains AC/DC motors, transformers, and power supply units.")
    add("B02","KS-IT-Lab",2,40,"laboratory","D09","IT Lab on the second floor of KS Block. Contains 40 networked desktop PCs for networking and web labs.")

    # BD Block (B03) rooms
    add("B03","BD-2-103",1,60,"classroom","D02","AIML Classroom on the first floor of BD Block.")
    add("B03","BD-2-104",1,60,"classroom","D02","AIML Classroom on the first floor of BD Block.")
    add("B03","BD-2-201",2,60,"classroom","D03","AIDS Classroom on the second floor of BD Block.")
    add("B03","BD-2-202",2,60,"classroom","D03","AIDS Classroom on the second floor of BD Block.")
    add("B03","BD-2-301",3,60,"classroom","D02","AIML Classroom on the third floor of BD Block. Primary classroom for AIML third-year students.")
    add("B03","BD-2-302",3,60,"classroom","D04","CSBS Classroom on the third floor of BD Block.")
    add("B03","BD-2-401",4,60,"classroom","D05","Civil Engineering Classroom on the fourth floor of BD Block.")
    add("B03","JS-Block-A",0,120,"seminar_hall","D02","JS Block A is a large open seminar hall on the ground floor of BD Block. Used for inter-departmental events, technical talks, and college-wide conferences.")
    add("B03","JS-Block-B",0,120,"seminar_hall","D03","JS Block B is a seminar hall adjacent to JS Block A in BD Block. Used for departmental events and placement training sessions.")
    add("B03","BD-AI-Lab",3,40,"laboratory","D02","AI Lab on the third floor of BD Block. Equipped with high-performance workstations for machine learning and deep learning experiments.")
    add("B03","BD-DS-Lab",2,40,"laboratory","D03","Data Science Lab on the second floor of BD Block. Equipped with workstations running Python, R, Tableau, and cloud tools.")

    # ME Block (B04) rooms
    add("B04","ME-301",3,60,"classroom","D10","Mechanical Engineering Classroom on the third floor of ME Block.")
    add("B04","ME-302",3,60,"classroom","D10","Mechanical Engineering Classroom on the third floor of ME Block.")
    add("B04","ME-401",4,60,"classroom","D10","Mechanical Engineering Classroom on the fourth floor of ME Block.")
    add("B04","ME-CAD-Lab",2,30,"laboratory","D10","CAD/CAM Lab on the second floor of ME Block. Equipped with workstations running SolidWorks, AutoCAD, and ANSYS.")
    add("B04","ME-Thermo-Lab",1,20,"laboratory","D10","Thermodynamics and Fluid Mechanics Lab on the first floor of ME Block.")

    # ME Workshop (B05) rooms
    add("B05","MEW-Main",0,200,"workshop","D10","Main workshop floor of the ME Workshop building. Contains lathes, milling machines, welding bays, and CNC machines. Used for manufacturing practice and symposiums.")
    add("B05","MEW-Hall",0,300,"seminar_hall","D10","Large event hall within the ME Workshop building used for symposiums, technical fests, and cultural events.")

    write_csv("core", "rooms.csv",
        ["room_id","building_id","room_number","floor","capacity","room_type","department_id","description"],
        rows)

    room_map = {r[2]: r[0] for r in rows}
    all_room_ids = [r[0] for r in rows]
    return all_room_ids, room_map, rows

def gen_faculty(room_rows):
    # Map room_number -> room_id
    room_by_num = {r[2]: r[0] for r in room_rows}

    rows = [
        # D01 CSE
        ["F001","Dr. Karthik Menon","Professor","D01","B01","R019","karthik.menon@sce.edu","+91-9876541001","Mon-Fri 10:00-12:00"],
        ["F002","Dr. Suresh Babu","Associate Professor","D01","B01","R019","suresh.babu@sce.edu","+91-9876541002","Mon-Fri 11:00-13:00"],
        ["F003","Prof. Vikram Shah","Assistant Professor","D01","B01","R020","vikram.shah@sce.edu","+91-9876541003","Mon-Fri 14:00-16:00"],
        ["F004","Prof. Anita Rao","Assistant Professor","D01","B01","R020","anita.rao@sce.edu","+91-9876541004","Tue-Thu 10:00-12:00"],
        # D02 AIML
        ["F005","Dr. Arvind Raman","Professor","D02","B03","R039","arvind.raman@sce.edu","+91-9876541005","Mon-Fri 09:00-11:00"],
        ["F006","Prof. Aishwarya Rao","Assistant Professor","D02","B03","R039","aishwarya.rao@sce.edu","+91-9876541006","Mon-Fri 14:00-16:00"],
        ["F007","Dr. Deepa Srinivasan","Associate Professor","D02","B03","R040","deepa.srinivasan@sce.edu","+91-9876541007","Mon-Wed 10:00-12:00"],
        # D03 AIDS
        ["F008","Dr. Priya Nair","Associate Professor","D03","B03","R040","priya.nair@sce.edu","+91-9876541008","Mon-Fri 10:00-12:00"],
        ["F009","Prof. Rahul Dev","Assistant Professor","D03","B03","R041","rahul.dev@sce.edu","+91-9876541009","Tue-Fri 14:00-16:00"],
        # D04 CSBS
        ["F010","Dr. Divya Srinivas","Associate Professor","D04","B03","R041","divya.srinivas@sce.edu","+91-9876541010","Mon-Fri 10:00-12:00"],
        ["F011","Prof. Ramesh Kumar","Assistant Professor","D04","B03","R042","ramesh.kumar@sce.edu","+91-9876541011","Mon-Thu 14:00-16:00"],
        # D05 CIVIL
        ["F012","Dr. Naveen Kumar","Professor","D05","B03","R042","naveen.kumar@sce.edu","+91-9876541012","Mon-Fri 09:00-11:00"],
        ["F013","Prof. Meena Reddy","Assistant Professor","D05","B03","R043","meena.reddy@sce.edu","+91-9876541013","Mon-Fri 14:00-16:00"],
        # D06 ECE
        ["F014","Dr. Meena Krishnan","Professor","D06","B02","R029","meena.krishnan@sce.edu","+91-9876541014","Mon-Fri 09:00-11:00"],
        ["F015","Prof. Sunil Thomas","Assistant Professor","D06","B02","R029","sunil.thomas@sce.edu","+91-9876541015","Mon-Fri 14:00-16:00"],
        ["F016","Dr. Kavita Iyer","Associate Professor","D06","B02","R030","kavita.iyer@sce.edu","+91-9876541016","Tue-Fri 10:00-12:00"],
        # D07 EEE
        ["F017","Dr. Sanjay Iyer","Associate Professor","D07","B02","R030","sanjay.iyer@sce.edu","+91-9876541017","Mon-Fri 10:00-12:00"],
        ["F018","Prof. Lakshmi Priya","Assistant Professor","D07","B02","R031","lakshmi.priya@sce.edu","+91-9876541018","Mon-Thu 14:00-16:00"],
        # D08 ICE
        ["F019","Dr. Rahul Verma","Assistant Professor","D08","B02","R031","rahul.verma@sce.edu","+91-9876541019","Mon-Fri 10:00-12:00"],
        ["F020","Prof. Sneha Pillai","Assistant Professor","D08","B02","R032","sneha.pillai@sce.edu","+91-9876541020","Tue-Fri 14:00-16:00"],
        # D09 IT
        ["F021","Dr. Lakshmi Narayanan","Associate Professor","D09","B02","R032","lakshmi.narayanan@sce.edu","+91-9876541021","Mon-Fri 09:00-11:00"],
        ["F022","Prof. Ajay Menon","Assistant Professor","D09","B02","R033","ajay.menon@sce.edu","+91-9876541022","Mon-Fri 14:00-16:00"],
        # D10 MECH
        ["F023","Dr. Hari Prasad","Professor","D10","B04","R046","hari.prasad@sce.edu","+91-9876541023","Mon-Fri 09:00-11:00"],
        ["F024","Prof. Geetha Rajan","Assistant Professor","D10","B04","R046","geetha.rajan@sce.edu","+91-9876541024","Mon-Fri 14:00-16:00"],
        ["F025","Dr. Mohan Lal","Associate Professor","D10","B04","R047","mohan.lal@sce.edu","+91-9876541025","Tue-Fri 10:00-12:00"],
    ]
    write_csv("core", "faculty.csv",
        ["faculty_id","faculty_name","designation","department_id","building_id","cabin_room_id","email","phone","office_hours"],
        rows)
    return {r[0] for r in rows}

def gen_subjects():
    rows = [
        # D01 CSE — Semesters 1-8
        ["SUB001","CS101","Engineering Mathematics I","D01",4,"theory",1,"I","Fundamental mathematics for engineers covering matrices, calculus, and differential equations."],
        ["SUB002","CS102","Programming in C","D01",4,"theory",1,"I","Introduction to C programming: syntax, data types, control structures, functions, and pointers."],
        ["SUB003","CS102L","Programming Lab","D01",2,"lab",1,"I","Practical C programming laboratory sessions."],
        ["SUB004","CS201","Data Structures","D01",4,"theory",3,"II","Stacks, queues, linked lists, trees, graphs, and sorting algorithms."],
        ["SUB005","CS202","Operating Systems","D01",4,"theory",3,"II","Process management, memory management, file systems, and concurrency."],
        ["SUB006","CS301","Database Management Systems","D01",4,"theory",5,"III","Relational databases, SQL, normalization, transactions, and PL/SQL."],
        ["SUB007","CS302","Computer Networks","D01",4,"theory",5,"III","OSI model, TCP/IP, routing, switching, and network security fundamentals."],
        ["SUB008","CS401","Software Engineering","D01",4,"theory",7,"IV","Software development life cycle, agile methods, testing, and project management."],
        ["SUB009","CS402","Machine Learning","D01",4,"elective",7,"IV","Supervised and unsupervised learning, neural networks, and model evaluation."],
        # D02 AIML
        ["SUB010","AI101","Introduction to AI","D02",4,"theory",1,"I","History and foundations of artificial intelligence, search algorithms, and knowledge representation."],
        ["SUB011","AI201","Machine Learning","D02",4,"theory",3,"II","Regression, classification, clustering, ensemble methods, and model optimization."],
        ["SUB012","AI201L","ML Lab","D02",2,"lab",3,"II","Hands-on machine learning using scikit-learn and Python."],
        ["SUB013","AI301","Deep Learning","D02",4,"theory",5,"III","Neural networks, CNNs, RNNs, transformers, and practical deep learning frameworks."],
        ["SUB014","AI302","Natural Language Processing","D02",4,"theory",5,"III","Text preprocessing, word embeddings, language models, and NLP applications."],
        ["SUB015","AI401","Computer Vision","D02",4,"theory",7,"IV","Image processing, object detection, segmentation, and vision transformers."],
        # D03 AIDS
        ["SUB016","DS101","Python for Data Science","D03",4,"theory",1,"I","Python programming with focus on data manipulation using pandas and NumPy."],
        ["SUB017","DS201","Data Warehousing","D03",4,"theory",3,"II","Data warehouse architecture, ETL pipelines, and OLAP systems."],
        ["SUB018","DS301","Big Data Analytics","D03",4,"theory",5,"III","Hadoop, Spark, MapReduce, and distributed data processing."],
        # D04 CSBS
        ["SUB019","CSBS101","Fundamentals of Business","D04",4,"theory",1,"I","Business organization, management principles, and entrepreneurship."],
        ["SUB020","CSBS201","ERP Systems","D04",4,"theory",3,"II","Enterprise Resource Planning using SAP and Oracle platforms."],
        # D05 CIVIL
        ["SUB021","CE101","Engineering Drawing","D05",4,"theory",1,"I","Technical drawing, orthographic projections, and AutoCAD basics."],
        ["SUB022","CE201","Structural Analysis","D05",4,"theory",3,"II","Analysis of beams, frames, trusses, and influence lines."],
        # D06 ECE
        ["SUB023","EC101","Basic Electronics","D06",4,"theory",1,"I","Diodes, transistors, amplifiers, and basic electronic circuits."],
        ["SUB024","EC201","Digital Electronics","D06",4,"theory",3,"II","Boolean algebra, logic gates, combinational and sequential circuits."],
        ["SUB025","EC301","VLSI Design","D06",4,"theory",5,"III","CMOS design, HDL, layout, and verification of digital ICs."],
        # D07 EEE
        ["SUB026","EE101","Circuit Theory","D07",4,"theory",1,"I","KVL, KCL, Thevenin, Norton theorems, and AC circuit analysis."],
        ["SUB027","EE201","Electrical Machines","D07",4,"theory",3,"II","DC motors, transformers, induction motors, and synchronous machines."],
        # D08 ICE
        ["SUB028","IC101","Instrumentation Principles","D08",4,"theory",1,"I","Sensors, transducers, measurement systems, and signal conditioning."],
        ["SUB029","IC201","Process Control","D08",4,"theory",3,"II","PID controllers, control system design, and SCADA systems."],
        # D09 IT
        ["SUB030","IT101","Web Technologies","D09",4,"theory",1,"I","HTML, CSS, JavaScript, and introductory web development."],
        ["SUB031","IT201","Computer Networks","D09",4,"theory",3,"II","Networking fundamentals, protocols, and network administration."],
        ["SUB032","IT301","Cloud Computing","D09",4,"theory",5,"III","Cloud platforms (AWS, GCP, Azure), virtualization, and DevOps basics."],
        # D10 MECH
        ["SUB033","ME101","Engineering Mechanics","D10",4,"theory",1,"I","Statics, dynamics, free body diagrams, and friction."],
        ["SUB034","ME201","Thermodynamics","D10",4,"theory",3,"II","Laws of thermodynamics, heat engines, cycles, and energy transfer."],
        ["SUB035","ME301","Fluid Mechanics","D10",4,"theory",5,"III","Fluid properties, Bernoulli equation, viscous flow, and turbomachinery."],
    ]
    write_csv("core", "subject_master.csv",
        ["subject_id","subject_code","subject_name","department_id","credits","subject_type","semester","year","description"],
        rows)
    return {r[0]: r for r in rows}

def gen_offices(room_rows):
    room_by_num = {r[2]: r[0] for r in room_rows}
    rows = [
        ["OFF01","Principal Office","B01","R001",0,"Dr. V. Ramachandran","Mon-Fri 09:00-17:00","The Principal Office is on the ground floor of RV Block. The Principal oversees all academic, administrative, and student welfare activities of the institution."],
        ["OFF02","Administrative Office","B01","R002",0,"Mr. S. Krishnamurthy","Mon-Fri 09:00-17:00","The Administrative Office handles student records, correspondence, ID card issuance, bonafide certificates, and general administrative queries."],
        ["OFF03","Accounts Office","B01","R003",0,"Mr. T. Balakrishnan","Mon-Fri 09:00-17:00","The Accounts Office handles all fee payments, fee receipts, scholarship disbursements, and financial transactions."],
        ["OFF04","Exam Cell","B01","R008",1,"Dr. P. Sundaram","Mon-Fri 09:00-17:00","The Exam Cell coordinates all examination activities including scheduling, hall ticket distribution, result publication, and arrear management."],
        ["OFF05","Placement Cell","B01","R009",1,"Ms. R. Kavitha","Mon-Fri 09:00-17:00","The Placement Cell coordinates campus placement drives, internship programs, career counseling, and connects students with industry partners."],
        ["OFF06","Admission Cell","B01","R004",0,"Mr. A. Venkatesh","Mon-Fri 09:00-16:00","The Admission Cell handles new student enrollments, document verification, and lateral entry applications."],
        ["OFF07","Library Office","B01","R010",1,"Ms. D. Subramanian","Mon-Sat 08:30-17:30","The Library Office manages book lending, renewals, library membership, and maintains the digital catalogue."],
        ["OFF08","Transport Office","B01","R005",0,"Mr. K. Selvam","Mon-Sat 08:00-16:00","The Transport Office handles bus pass applications, transport fee collection, and manages the college bus scheduling."],
        ["OFF09","HOD Office — CSE","B01","R019",3,"Dr. Karthik Menon","Mon-Fri 09:00-17:00","HOD Office for Computer Science and Engineering on the third floor of RV Block."],
        ["OFF10","HOD Office — AIML","B03","R039",3,"Dr. Arvind Raman","Mon-Fri 09:00-17:00","HOD Office for the AIML department located on the third floor of BD Block."],
        ["OFF11","IT Support Desk","B01","R020",2,"Mr. P. Subhash","Mon-Fri 08:30-17:30","IT Support Desk located in the computer lab area of RV Block. Handles WiFi issues, email setup, LMS access, and student portal problems."],
    ]
    write_csv("core", "offices.csv",
        ["office_id","office_name","building_id","room_id","floor","officer_in_charge","office_hours","description"],
        rows)
    return {r[0] for r in rows}

def gen_students(faculty_ids, dept_ids, hostel_ids, route_ids, room_ids):
    random.seed(42)
    first_names = ["Arjun","Priya","Rohit","Kavya","Siddharth","Ananya","Karthik","Divya","Vikram","Sneha",
                   "Aditya","Meera","Rahul","Pooja","Nikhil","Isha","Suresh","Lakshmi","Vishal","Nithya",
                   "Akash","Deepika","Harish","Vaishnavi","Ganesh","Swathi","Rajan","Keerthi","Ashwin","Padma",
                   "Venkat","Revathi","Siva","Nandini","Manoj","Sowmya","Balaji","Jothika","Srinath","Hema",
                   "Arun","Saranya","Praveen","Brindha","Kumar","Ranjani","Dinesh","Shobha","Vijay","Mythili"]
    last_names  = ["Kumar","Rajan","Menon","Nair","Krishnan","Suresh","Balaji","Raghavan","Iyer","Pillai",
                   "Arumugam","Sundaram","Murugan","Gopal","Venkatesh","Ramesh","Anand","Devi","Sharma","Patel"]
    depts = ["D01","D01","D02","D03","D04","D05","D06","D07","D08","D09","D10"]
    years = ["I","II","III","IV"]
    sections = ["A","B"]
    advisor_map = {
        "D01": ["F001","F002","F003","F004"],
        "D02": ["F005","F006","F007"],
        "D03": ["F008","F009"],
        "D04": ["F010","F011"],
        "D05": ["F012","F013"],
        "D06": ["F014","F015","F016"],
        "D07": ["F017","F018"],
        "D08": ["F019","F020"],
        "D09": ["F021","F022"],
        "D10": ["F023","F024","F025"],
    }
    classroom_map = {
        "D01": ["R011","R012","R013","R014","R015","R016","R017","R018"],
        "D02": ["R033","R034","R037","R038"],
        "D03": ["R035","R036"],
        "D04": ["R038"],
        "D05": ["R039"],
        "D06": ["R022","R023","R024"],
        "D07": ["R025","R026"],
        "D08": ["R027"],
        "D09": ["R028","R028"],
        "D10": ["R044","R045","R046"],
    }

    rows = []
    used_reg = set()
    year_start = {"I":26,"II":25,"III":24,"IV":23}
    for i in range(1, 76):
        sid = f"STU{i:04d}"
        dept = random.choice(depts)
        year = random.choice(years)
        sec  = random.choice(sections)
        yr_code = year_start.get(year, 25)
        reg = f"22{yr_code}1{dept[1:]:0>2}{i:04d}"
        while reg in used_reg:
            reg = reg[:-4] + f"{random.randint(1000,9999)}"
        used_reg.add(reg)
        fname = random.choice(first_names)
        lname = random.choice(last_names)
        name  = f"{fname} {lname}"
        adv   = random.choice(advisor_map.get(dept,["F001"]))
        rm    = random.choice(classroom_map.get(dept,["R011"]))
        hos   = random.choice(list(hostel_ids)) if random.random() < 0.5 else ""
        rte   = random.choice(list(route_ids))  if not hos else ""
        rows.append([sid, reg, name, dept, year, sec, adv, rm, hos, rte])

    write_csv("core", "student_profiles.csv",
        ["student_id","register_number","name","department_id","year","section","advisor_faculty_id","current_room_id","hostel_id","transport_route_id"],
        rows)
    return {r[0] for r in rows}

# ---------------------------------------------------------------------------
# ACADEMIC
# ---------------------------------------------------------------------------

def gen_academic_calendar():
    rows = [
        ["CAL01","semester_start","Odd Semester 2026–27 Begins","2026-07-15","2026-07-15","all","The academic odd semester for 2026–27 begins on 15 July 2026. All departments resume classes. Students should collect their timetables from the respective departments."],
        ["CAL02","orientation","First Year Orientation Program","2026-07-16","2026-07-17","I","Orientation for first-year students is conducted on 16–17 July 2026 at RV Block Seminar Hall 1. Parents are welcome on Day 1."],
        ["CAL03","deadline","Last Date for Fee Payment — Semester 1","2026-07-31","2026-07-31","I","Final date to pay semester fees without late penalty. Pay at the Accounts Office, RV Block, Ground Floor."],
        ["CAL04","deadline","Last Date for Fee Payment — Sem 3/5/7","2026-08-05","2026-08-05","all","Fee payment deadline for second, third, and fourth-year students."],
        ["CAL05","deadline","Club Registration Deadline","2026-08-10","2026-08-10","all","Last date for students to register for college clubs and associations for the 2026–27 academic year."],
        ["CAL06","exam_week","Internal Assessment 1","2026-08-25","2026-09-05","all","First internal assessment examinations for all departments. Schedule will be published by the Exam Cell."],
        ["CAL07","holiday","Independence Day Holiday","2026-08-15","2026-08-15","all","Independence Day national holiday. Campus remains open but no academic activities."],
        ["CAL08","deadline","Project Abstract Submission","2026-09-15","2026-09-15","III","Third-year students must submit mini-project abstracts to their respective HODs by 15 September 2026."],
        ["CAL09","exam_week","Internal Assessment 2","2026-10-05","2026-10-15","all","Second internal assessment examinations for all departments."],
        ["CAL10","holiday","Dussehra Holidays","2026-10-01","2026-10-05","all","Dussehra holiday block. Campus closed."],
        ["CAL11","deadline","Project Report Submission — Final Year","2026-10-20","2026-10-20","IV","Final-year students must submit their project reports to the department before this date."],
        ["CAL12","exam_week","Internal Assessment 3 / Model Exam","2026-11-01","2026-11-12","all","Third internal assessment and model exams. Results will determine exam eligibility."],
        ["CAL13","exam_week","Semester End Examinations","2026-11-23","2026-12-15","all","End-semester university examinations begin on 23 November 2026. Hall tickets will be issued one week prior by the Exam Cell."],
        ["CAL14","vacation","Winter Vacation","2026-12-20","2027-01-05","all","Winter vacation for all students. Campus security and hostel operations continue."],
        ["CAL15","semester_start","Even Semester 2026–27 Begins","2027-01-06","2027-01-06","all","The even semester begins on 6 January 2027."],
        ["CAL16","deadline","Hostel Application Deadline — Even Semester","2026-12-20","2026-12-20","all","Students wishing to apply for hostel accommodation for the even semester must submit applications by this date."],
        ["CAL17","holiday","Pongal Holidays","2027-01-14","2027-01-16","all","Pongal holiday block. Campus closed."],
        ["CAL18","exam_week","Internal Assessment 4","2027-02-15","2027-02-25","all","Internal assessment 1 for even semester."],
        ["CAL19","semester_end","Even Semester Ends","2027-05-15","2027-05-15","all","The even semester ends with completion of practical exams. Results expected within 60 days."],
    ]
    write_csv("academic", "academic_calendar.csv",
        ["calendar_id","event_type","title","start_date","end_date","applies_to","description"],
        rows)

def gen_fees():
    rows = []
    depts = ["D01","D02","D03","D04","D05","D06","D07","D08","D09","D10"]
    tuition = {"D01":90000,"D02":95000,"D03":95000,"D04":88000,"D05":75000,
               "D06":80000,"D07":78000,"D08":78000,"D09":82000,"D10":72000}
    years = ["I","II","III","IV"]
    fid = 1
    for dept in depts:
        for yr in years:
            t = tuition[dept]
            lab = 5000 if yr != "I" else 3000
            rows.append([f"FEE{fid:02d}", dept, yr, "2026-2027", t, lab, 2000, 3000, 2000, t+lab+2000+3000+2000, "2026-07-31", 100])
            fid += 1
    write_csv("academic", "fees_structure.csv",
        ["fee_id","department_id","year","academic_year","tuition_fee","lab_fee","library_fee","exam_fee","misc_fee","total_fee","due_date","late_penalty_per_day"],
        rows)

def gen_exam_schedule(dept_ids, subject_map, room_ids):
    rows = []
    eid = 1
    dept_subjects = {}
    for sid, sdata in subject_map.items():
        s_dept = sdata[3]
        if s_dept not in dept_subjects:
            dept_subjects[s_dept] = []
        dept_subjects[s_dept].append((sid, sdata))

    hall_rooms = ["R011","R012","R013","R014","R022","R023","R033","R034","R035","R044"]
    exam_dates = [
        "2026-08-25","2026-08-26","2026-08-27","2026-08-28","2026-08-29",
        "2026-09-01","2026-09-02","2026-09-03","2026-09-04","2026-09-05",
    ]
    for dept, subjects in dept_subjects.items():
        for i, (sid, sdata) in enumerate(subjects[:4]):
            yr = sdata[7]
            sem = sdata[6]
            hall = random.choice(hall_rooms)
            rows.append([
                f"EXM{eid:03d}", dept, yr, sem, sid,
                exam_dates[i % len(exam_dates)],
                "09:30","180", hall, "internal_1", d(0)
            ])
            eid += 1
    write_csv("academic", "exam_schedule.csv",
        ["exam_id","department_id","year","semester","subject_id","exam_date","exam_time","duration_minutes","hall_room_id","exam_type","last_updated"],
        rows)

def gen_timetable(room_rows, faculty_rows, subject_map):
    # Simple timetable for AIML-III-A and CSE-I-A and ECE-II-A
    days = ["Monday","Tuesday","Wednesday","Thursday","Friday"]
    periods = [
        ("P1","09:00-09:50"),("P2","09:50-10:40"),("P3","10:55-11:45"),
        ("P4","11:45-12:35"),("P5","01:20-02:10"),("P6","02:10-03:00"),
    ]
    # AIML-III-A subjects + faculty
    aiml_slots = [
        ("SUB013","F005","R037","theory"),("SUB011","F006","R037","theory"),
        ("SUB014","F007","R037","theory"),("SUB012","F005","R040","lab"),
        ("SUB013","F006","R037","theory"),("SUB011","F007","R037","theory"),
    ]
    # CSE-I-A subjects + faculty
    cse_slots = [
        ("SUB001","F002","R011","theory"),("SUB002","F003","R011","theory"),
        ("SUB003","F004","R019","lab"),("SUB002","F002","R011","theory"),
        ("SUB001","F003","R011","theory"),("SUB003","F004","R019","lab"),
    ]
    # ECE-II-A subjects + faculty
    ece_slots = [
        ("SUB023","F014","R022","theory"),("SUB024","F015","R022","theory"),
        ("SUB023","F016","R029","lab"),("SUB024","F014","R022","theory"),
        ("SUB023","F015","R022","theory"),("SUB024","F016","R022","theory"),
    ]

    rows = []
    tt_id = 1
    combos = [
        ("D02","III","A",5,"2026-2027",aiml_slots),
        ("D01","I","A",1,"2026-2027",cse_slots),
        ("D06","II","A",3,"2026-2027",ece_slots),
    ]
    for dept, year, sec, sem, ay, slots in combos:
        slot_cycle = list(slots) * 6
        idx = 0
        for day in days:
            for p, t in periods:
                sub_id, fac_id, rm_id, lot = slot_cycle[idx % len(slots)]
                rows.append([
                    f"TT{tt_id:04d}", dept, year, sec, sem, ay,
                    day, p, t, sub_id, rm_id, fac_id, lot,
                    "2026-07-15","2026-11-22"
                ])
                tt_id += 1
                idx += 1

    write_csv("academic", "timetable.csv",
        ["timetable_id","department_id","year","section","semester","academic_year",
         "day","period","time","subject_id","room_id","faculty_id","lab_or_theory",
         "effective_from","effective_until"],
        rows)

# ---------------------------------------------------------------------------
# CAMPUS
# ---------------------------------------------------------------------------

def gen_facilities():
    rows = [
        ["FAC01","Central Library","academic","B01","R010","Mon-Sat 08:30-17:30","The Central Library on the first floor of RV Block houses over 10,000 books, national and international journals, digital resources, and e-library access. Students can borrow up to 3 books at a time. Membership is free for all enrolled students."],
        ["FAC02","Central Canteen","food","B08","","Mon-Sat 08:00-16:30","The Central Canteen in the Canteen Block serves hot breakfast, lunch, and evening snacks. Menu includes both vegetarian and non-vegetarian options at subsidized rates. Operates on weekdays and Saturdays."],
        ["FAC03","Medical Room","health","B01","R006","Mon-Fri 09:00-16:00","The Medical Room on the ground floor of RV Block provides first-aid, basic medication, and health consultation. A campus nurse is available full-time during working hours. Students requiring emergency care are referred to the nearest government hospital."],
        ["FAC04","Parking Area","transport","B06","","24x7","The Parking Area near the Main Gate provides designated spots for two-wheelers and four-wheelers. Students require a valid parking permit issued by the Transport Office."],
        ["FAC05","RO Drinking Water","utility","B01","","24x7","RO-purified drinking water stations are available on every floor of every academic block. Stations are serviced and cleaned daily."],
        ["FAC06","Restrooms","utility","B01","","24x7","Separate restrooms for male and female students are available on every floor of all academic blocks (RV, KS, BD, ME)."],
        ["FAC07","WiFi Zone","internet","B01","","Mon-Sat 08:00-20:00","Campus WiFi is available in all academic blocks (RV, KS, BD, ME). Login using your student register number. Speed: 100 Mbps shared. Contact IT Support Desk in RV Block for login issues."],
        ["FAC08","Stationery Store","shop","B01","","Mon-Sat 09:00-17:00","The Stationery Store on the ground floor of RV Block sells notebooks, pens, graph sheets, drawing instruments, and college-branded items."],
        ["FAC09","Sports Ground","sports","B07","","Mon-Sat 06:00-20:00","The Sports Ground behind BD Block is used for cricket, football, volleyball, and athletics. The annual Sports Meet is held here. Students can use the ground outside class hours with prior permission."],
        ["FAC10","Reprography / Xerox","shop","B01","","Mon-Sat 09:00-18:00","Photocopying, printing, and spiral binding services are available near the library on the ground floor of RV Block."],
    ]
    write_csv("campus", "facilities.csv",
        ["facility_id","facility_name","category","building_id","room_id","timing","description"],
        rows)

def gen_navigation():
    # Bidirectional edges between campus buildings/locations
    edges = [
        # From Main Gate
        ("B06","B01",80,2,"yes","College Bus Drop Zone","From the Main Gate, walk straight along the main road. RV Block will be directly ahead on your right within 80 meters.","From RV Block, walk towards the main road. The Main Gate is 80 meters straight ahead."),
        ("B06","B08",90,2,"yes","Security Cabin","From the Main Gate, walk along the main road and turn left toward the canteen building visible from the gate.","From the Canteen Block, walk past the security cabin toward the main road to reach the Main Gate."),

        # RV Block connections
        ("B01","B02",150,3,"yes","Central Pathway","From RV Block, take the central pathway heading east. KS Block is on your left after the pathway junction.","From KS Block, walk west along the central pathway. RV Block is at the end of the pathway."),
        ("B01","B03",200,3,"yes","Central Pathway Junction","From RV Block, walk along the central pathway past KS Block junction. BD Block is straight ahead.","From BD Block, walk back along the central pathway past the junction. RV Block is at the far end."),
        ("B01","B08",50,1,"yes","Near RV Block Entrance","From RV Block, exit through the main entrance and the Canteen Block is immediately on your left.","From the Canteen Block, walk to the right. RV Block main entrance is 50 meters away."),
        ("B01","B06",80,2,"yes","Main Road","From RV Block, walk toward the Main Gate along the main road. The gate is visible from the RV Block entrance.","From the Main Gate, walk straight ahead. RV Block is the large building at the end of the main road."),

        # KS Block connections
        ("B02","B01",150,3,"yes","Central Pathway","From KS Block, walk west along the central pathway. RV Block is at the end.","From RV Block, take the central pathway east. KS Block is on your right after 150 meters."),
        ("B02","B03",100,2,"yes","Academic Corridor","From KS Block, walk along the academic corridor connecting to BD Block. Use the covered walkway.","From BD Block, follow the covered walkway toward KS Block."),
        ("B02","B04",200,4,"no","Sports Ground side","From KS Block, walk past the sports ground side toward ME Block. The path is not fully accessible.","From ME Block, walk back toward the sports ground and continue to KS Block."),

        # BD Block connections
        ("B03","B01",200,3,"yes","Central Pathway","From BD Block, take the central pathway west toward RV Block.","From RV Block, walk east along the central pathway. BD Block is visible at the far end."),
        ("B03","B02",100,2,"yes","Academic Corridor","From BD Block, take the covered academic corridor heading toward KS Block.","From KS Block, use the covered corridor to reach BD Block."),
        ("B03","B05",120,2,"yes","Behind BD Block","From BD Block, exit through the rear entrance. The ME Workshop is directly behind.","From ME Workshop, enter through the rear gate. BD Block is immediately ahead."),
        ("B03","B07",80,1,"yes","Rear Exit","From BD Block, take the rear exit and the Sports Ground is immediately visible.","From the Sports Ground, walk toward BD Block rear entrance."),

        # ME Block connections
        ("B04","B05",60,1,"yes","Workshop Path","From ME Block, take the side exit. The ME Workshop is 60 meters away.","From ME Workshop, walk toward ME Block. It is directly adjacent."),
        ("B04","B02",200,4,"no","Side road","From ME Block, walk along the side road past the sports area to reach KS Block.","From KS Block, take the side road past the sports area to reach ME Block."),

        # ME Workshop
        ("B05","B04",60,1,"yes","Side Path","From ME Workshop, the ME Block is directly adjacent via the connecting path.","From ME Block, the ME Workshop is directly accessible through the side exit."),
        ("B05","B03",120,2,"yes","Rear Pathway","From ME Workshop, walk along the rear pathway to reach BD Block.","From BD Block, exit rear and walk to ME Workshop."),

        # Sports Ground
        ("B07","B03",80,1,"yes","Rear Entrance","From the Sports Ground, walk toward BD Block's rear entrance.","From BD Block, exit rear. Sports Ground is immediately visible."),
        ("B07","B09",150,3,"yes","North Campus Road","From the Sports Ground, take the north campus road toward the Hostel Complex.","From the Hostel Complex, walk south along the north campus road toward the Sports Ground."),

        # Hostel Complex
        ("B09","B07",150,3,"yes","North Campus Road","From the Hostel Complex, walk south along the campus road toward the Sports Ground.","From the Sports Ground, take the north campus road north to the Hostel Complex."),
        ("B09","B01",350,6,"yes","Main Campus Road","From the Hostel Complex, walk along the main campus road south. RV Block is at the southern end of the campus.","From RV Block, walk north along the main campus road. The Hostel Complex is at the far northern end of campus."),
    ]

    rows = []
    for i, e in enumerate(edges):
        src, dst, dist, mins, acc, lm, dir_fwd, dir_rev = e
        rows.append([f"NAV{i+1:03d}", src, dst, dist, mins, acc, lm, dir_fwd])

    write_csv("campus", "navigation.csv",
        ["edge_id","source_building_id","dest_building_id","distance_meters","estimated_minutes","accessible_route","landmark","directions"],
        rows)

def gen_hostels():
    rows = [
        ["H01","Ganga Men's Hostel Block A","male","Mr. P. Murugan","9876540101","ganga.warden@sce.edu","double",36000,"yes",40,80,"B09","In-time 10:00 PM. No visitors after 6 PM. Mess food compulsory. Mobile phones allowed. Ragging strictly prohibited.","Ganga Men's Hostel Block A is a double-occupancy hostel for male students. Located in the Hostel Complex on the north campus. Includes mess, laundry, common room with TV, and reading room. Annual fee includes mess charges.","2026-07-01"],
        ["H02","Ganga Men's Hostel Block B","male","Mr. P. Murugan","9876540101","ganga.warden@sce.edu","triple",28000,"yes",40,120,"B09","Same rules as Block A.","Ganga Men's Hostel Block B offers triple-occupancy rooms with attached bathrooms. Suitable for students seeking affordable accommodation.","2026-07-01"],
        ["H03","Kaveri Women's Hostel Block A","female","Ms. R. Sumathi","9876540102","kaveri.warden@sce.edu","double",38000,"yes",40,80,"B09","In-time 9:00 PM. Female visitors only after 5 PM. Mess compulsory. Ragging strictly prohibited.","Kaveri Women's Hostel Block A is a double-occupancy hostel for female students. Features 24-hour security, CCTV monitoring, and a dedicated warden on duty.","2026-07-01"],
        ["H04","Kaveri Women's Hostel Block B","female","Ms. R. Sumathi","9876540102","kaveri.warden@sce.edu","triple",30000,"yes",40,120,"B09","Same rules as Block A.","Kaveri Women's Hostel Block B offers triple-occupancy rooms for female students at a more affordable fee.","2026-07-01"],
        ["H05","Saraswathi Men's Hostel","male","Mr. K. Venkatesh","9876540103","saras.warden@sce.edu","single",48000,"no",20,20,"B09","In-time 10:30 PM. Self-catering hostel. No mess facility.","Saraswathi Men's Hostel provides single-occupancy rooms for senior students. No mess; students use the campus canteen or outside food.","2026-07-01"],
    ]
    write_csv("campus", "hostel.csv",
        ["hostel_id","hostel_name","gender","warden_name","warden_phone","warden_email","room_type","fee_per_year","mess_included","total_rooms","capacity","nearest_building_id","rules_summary","description","last_updated"],
        rows)
    return {r[0] for r in rows}

def gen_transport():
    routes = [
        ["TR01","Route 1 — Tambaram to Campus","06:30","08:00","17:30",400,"Mon-Sat","bus","Route 1 picks up students from Tambaram Railway Station and key stops along GST Road before arriving at the Main Gate at 8:00 AM. Return departure at 5:30 PM."],
        ["TR02","Route 2 — Chromepet to Campus","06:45","08:00","17:30",350,"Mon-Sat","bus","Route 2 covers Chromepet, Pallavaram, and Meenambakkam before reaching campus. Ideal for students from south Chennai suburbs."],
        ["TR03","Route 3 — Velachery to Campus","07:00","08:00","17:30",450,"Mon-Sat","bus","Route 3 starts from Velachery MRTS station covering Medavakkam, Sholinganallur, and OMR before arriving at campus."],
        ["TR04","Route 4 — Porur to Campus","06:45","08:00","17:30",420,"Mon-Sat","bus","Route 4 covers Porur, Valasaravakkam, and Ramapuram areas before heading to campus via Mount Road."],
        ["TR05","Route 5 — Avadi to Campus","06:15","08:00","17:30",500,"Mon-Sat","bus","Route 5 originates from Avadi and covers Ambattur, Anna Nagar, and Koyambedu before reaching campus."],
        ["TR06","Route 6 — Perambur to Campus","06:30","08:00","17:30",380,"Mon-Sat","bus","Route 6 covers Perambur, Kolathur, and Anna Nagar East route to campus."],
        ["TR07","Route 7 — Sholinganallur to Campus","07:10","08:00","17:30",300,"Mon-Sat","van","Route 7 van service for students near Sholinganallur and Perungudi. Limited seats."],
        ["TR08","Route 8 — Guindy to Campus","06:50","08:00","17:30",350,"Mon-Sat","bus","Route 8 starts from Guindy covering Adambakkam and Nanganallur."],
        ["TR09","Route 9 — Maduravoyal to Campus","06:40","08:00","17:30",400,"Mon-Sat","bus","Route 9 covers Maduravoyal, Kattupakkam, and Poonamallee High Road."],
        ["TR10","Route 10 — Sriperumbudur to Campus","06:00","08:00","17:30",550,"Mon-Sat","bus","Route 10 is the longest route, originating from Sriperumbudur and covering Tambaram before campus."],
    ]
    write_csv("campus", "transport_routes.csv",
        ["route_id","route_name","departure_time","arrival_time","return_time","fare","days_of_operation","vehicle_type","description"],
        routes)
    return {r[0] for r in routes}

def gen_transport_stops(route_ids):
    stops_data = {
        "TR01":[("Tambaram Rly Station","06:30"),("Tambaram Bus Stand","06:35"),("Perungalathur","06:45"),("Guduvanchery","06:55"),("Singaperumal Koil","07:10"),("Campus Main Gate","08:00")],
        "TR02":[("Chromepet","06:45"),("Pallavaram","06:52"),("Meenambakkam","07:05"),("St. Thomas Mount","07:20"),("Vandalur","07:40"),("Campus Main Gate","08:00")],
        "TR03":[("Velachery MRTS","07:00"),("Medavakkam","07:10"),("Sholinganallur","07:20"),("Navalur","07:35"),("Siruseri","07:45"),("Campus Main Gate","08:00")],
        "TR04":[("Porur","06:45"),("Valasaravakkam","06:52"),("Ramapuram","07:00"),("Vadapalani","07:15"),("K.K. Nagar","07:30"),("Campus Main Gate","08:00")],
        "TR05":[("Avadi","06:15"),("Ambattur","06:30"),("Anna Nagar","06:50"),("Koyambedu","07:10"),("Guindy","07:30"),("Campus Main Gate","08:00")],
        "TR06":[("Perambur","06:30"),("Kolathur","06:40"),("Anna Nagar East","06:55"),("Koyambedu","07:15"),("Guindy","07:35"),("Campus Main Gate","08:00")],
        "TR07":[("Sholinganallur","07:10"),("Perungudi","07:18"),("Campus Main Gate","08:00")],
        "TR08":[("Guindy","06:50"),("Adambakkam","07:00"),("Nanganallur","07:10"),("Tambaram","07:35"),("Campus Main Gate","08:00")],
        "TR09":[("Maduravoyal","06:40"),("Kattupakkam","06:50"),("Poonamallee","07:05"),("Tambaram","07:35"),("Campus Main Gate","08:00")],
        "TR10":[("Sriperumbudur","06:00"),("Tambaram","07:00"),("Perungalathur","07:10"),("Guduvanchery","07:20"),("Campus Main Gate","08:00")],
    }
    rows = []
    for route_id, stops in stops_data.items():
        for i,(name,t) in enumerate(stops,1):
            rows.append([route_id, i, name, t])
    write_csv("junction", "transport_stops.csv",
        ["route_id","stop_number","stop_name","pickup_time"],
        rows)

def gen_canteen():
    rows = [
        ["MNU001","Monday","breakfast","Idli Sambar",20,"veg","08:00","10:00"],
        ["MNU002","Monday","breakfast","Masala Dosa",30,"veg","08:00","10:00"],
        ["MNU003","Monday","lunch","Rice + Sambar + Poriyal",50,"veg","12:00","14:30"],
        ["MNU004","Monday","lunch","Chicken Biryani",80,"nonveg","12:00","14:30"],
        ["MNU005","Monday","snacks","Vada + Tea",25,"veg","15:30","16:30"],
        ["MNU006","Tuesday","breakfast","Pongal + Chutney",20,"veg","08:00","10:00"],
        ["MNU007","Tuesday","breakfast","Uthappam",25,"veg","08:00","10:00"],
        ["MNU008","Tuesday","lunch","Rice + Rasam + Curry",50,"veg","12:00","14:30"],
        ["MNU009","Tuesday","lunch","Egg Fried Rice",65,"egg","12:00","14:30"],
        ["MNU010","Tuesday","snacks","Samosa + Chai",20,"veg","15:30","16:30"],
        ["MNU011","Wednesday","breakfast","Idiyappam + Coconut Milk",25,"veg","08:00","10:00"],
        ["MNU012","Wednesday","lunch","Rice + Dal + Pappad",50,"veg","12:00","14:30"],
        ["MNU013","Wednesday","lunch","Mutton Curry + Rice",90,"nonveg","12:00","14:30"],
        ["MNU014","Wednesday","snacks","Bajji + Coffee",20,"veg","15:30","16:30"],
        ["MNU015","Thursday","breakfast","Poori + Aloo Bhaji",30,"veg","08:00","10:00"],
        ["MNU016","Thursday","lunch","Rice + Kuzhambu + Papad",50,"veg","12:00","14:30"],
        ["MNU017","Thursday","lunch","Fish Curry + Rice",80,"nonveg","12:00","14:30"],
        ["MNU018","Thursday","snacks","Bread Omelette",35,"egg","15:30","16:30"],
        ["MNU019","Friday","breakfast","Chapati + Paneer Bhurji",35,"veg","08:00","10:00"],
        ["MNU020","Friday","lunch","Veg Biryani",60,"veg","12:00","14:30"],
        ["MNU021","Friday","lunch","Chicken Curry + Parotta",85,"nonveg","12:00","14:30"],
        ["MNU022","Friday","snacks","Sundal + Tea",15,"veg","15:30","16:30"],
        ["MNU023","Saturday","breakfast","Idli + Sambar",20,"veg","08:00","10:00"],
        ["MNU024","Saturday","lunch","Rice + Curd + Pickle",40,"veg","12:00","14:00"],
        ["MNU025","Daily","snacks","Tea",10,"veg","08:00","16:30"],
        ["MNU026","Daily","snacks","Coffee",12,"veg","08:00","16:30"],
        ["MNU027","Daily","snacks","Cold Water Bottle",15,"veg","08:00","16:30"],
        ["MNU028","Daily","breakfast","Plain Dosa",20,"veg","08:00","10:00"],
        ["MNU029","Daily","snacks","Banana",10,"veg","08:00","16:30"],
        ["MNU030","Daily","snacks","Biscuits",5,"veg","08:00","16:30"],
    ]
    write_csv("campus", "canteen_menu.csv",
        ["menu_id","day","meal_type","item_name","price","veg_nonveg","available_from","available_to"],
        rows)

def gen_library_books(dept_ids):
    books = [
        # CSE / General Computing
        ["LIB0001","Introduction to Algorithms","Cormen, Leiserson, Rivest, Stein","Algorithms","D01",3,"Shelf A1-Row 1","9780262033848","Comprehensive textbook on algorithms and data structures. Widely used in CSE and IT programs."],
        ["LIB0002","The C Programming Language","Kernighan and Ritchie","Programming","D01",4,"Shelf A1-Row 2","9780131103627","Classic reference for C programming by the creators of the language."],
        ["LIB0003","Clean Code","Robert C. Martin","Software Engineering","D01",2,"Shelf A1-Row 3","9780132350884","Best practices for writing maintainable and readable code."],
        ["LIB0004","Database System Concepts","Silberschatz, Korth, Sudarshan","Databases","D01",3,"Shelf A2-Row 1","9780078022159","Standard textbook for database management systems."],
        ["LIB0005","Computer Networks","Andrew Tanenbaum","Networking","D01",2,"Shelf A2-Row 2","9780132126953","Complete reference on computer networking protocols and systems."],
        ["LIB0006","Operating System Concepts","Silberschatz, Galvin","Operating Systems","D01",3,"Shelf A2-Row 3","9781118063330","The dinosaur book — standard OS textbook."],
        ["LIB0007","Design Patterns","Gang of Four","Software Engineering","D01",2,"Shelf A3-Row 1","9780201633610","Essential patterns for object-oriented software design."],
        ["LIB0008","Python Crash Course","Eric Matthes","Programming","D01",4,"Shelf A3-Row 2","9781593279288","Beginner-friendly Python programming guide."],
        # AIML / Data Science
        ["LIB0009","Pattern Recognition and Machine Learning","Bishop","Machine Learning","D02",2,"Shelf B1-Row 1","9780387310732","Authoritative ML textbook covering probabilistic models."],
        ["LIB0010","Deep Learning","Goodfellow, Bengio, Courville","Deep Learning","D02",3,"Shelf B1-Row 2","9780262035613","Comprehensive deep learning reference."],
        ["LIB0011","Hands-On Machine Learning","Aurélien Géron","Machine Learning","D02",4,"Shelf B1-Row 3","9781492032649","Practical ML with scikit-learn and TensorFlow."],
        ["LIB0012","Natural Language Processing with Python","Bird, Klein, Loper","NLP","D02",2,"Shelf B2-Row 1","9780596516499","Classic NLTK-based NLP textbook."],
        ["LIB0013","Artificial Intelligence: A Modern Approach","Russell and Norvig","Artificial Intelligence","D02",3,"Shelf B2-Row 2","9780136042594","The definitive AI textbook, used worldwide."],
        ["LIB0014","Python for Data Analysis","Wes McKinney","Data Science","D03",4,"Shelf B2-Row 3","9781491957660","pandas creator's guide to data analysis in Python."],
        ["LIB0015","Data Science for Business","Provost and Fawcett","Data Science","D03",2,"Shelf B3-Row 1","9781449361327","Connecting data science concepts to business problems."],
        # ECE / EEE
        ["LIB0016","Electronic Devices and Circuit Theory","Boylestad","Electronics","D06",3,"Shelf C1-Row 1","9780132622261","Standard electronics devices textbook."],
        ["LIB0017","Digital Design","Morris Mano","Digital Electronics","D06",4,"Shelf C1-Row 2","9780132774208","Classic digital logic design reference."],
        ["LIB0018","Signals and Systems","Oppenheim, Willsky","Signal Processing","D06",2,"Shelf C1-Row 3","9780138147570","Standard signals and systems textbook."],
        ["LIB0019","Electrical Machines","I.J. Nagrath","Electrical Machines","D07",3,"Shelf C2-Row 1","9780070965935","Standard textbook for electrical machines."],
        ["LIB0020","Power System Analysis","Stevenson","Power Systems","D07",2,"Shelf C2-Row 2","9780070614505","Comprehensive power systems analysis reference."],
        # ICE / IT
        ["LIB0021","Control Systems Engineering","Norman Nise","Control Systems","D08",3,"Shelf D1-Row 1","9781119474227","Standard control systems textbook."],
        ["LIB0022","Cloud Computing","Buyya, Broberg","Cloud Computing","D09",2,"Shelf D1-Row 2","9780470887998","Principles and practice of cloud computing."],
        ["LIB0023","Computer Organization and Architecture","Stallings","Computer Architecture","D01",3,"Shelf A4-Row 1","9780134101613","Standard computer organization reference."],
        # Mechanical
        ["LIB0024","Engineering Thermodynamics","Cengel, Boles","Thermodynamics","D10",4,"Shelf E1-Row 1","9780073398174","Standard thermodynamics textbook for engineers."],
        ["LIB0025","Fluid Mechanics","Cengel, Cimbala","Fluid Mechanics","D10",3,"Shelf E1-Row 2","9780073380322","Complete fluid mechanics reference."],
        ["LIB0026","Strength of Materials","R.K. Bansal","Strength of Materials","D10",2,"Shelf E1-Row 3","9788131808146","Standard strength of materials textbook."],
        # Civil
        ["LIB0027","Structural Analysis","R.C. Hibbeler","Structural Analysis","D05",3,"Shelf F1-Row 1","9780134610672","Standard structural analysis textbook."],
        ["LIB0028","Concrete Technology","M.S. Shetty","Concrete Technology","D05",2,"Shelf F1-Row 2","9788121900775","Comprehensive concrete technology reference."],
        # General
        ["LIB0029","Engineering Mathematics","B.S. Grewal","Mathematics",None,5,"Shelf G1-Row 1","9788174091956","The most widely used engineering mathematics reference in India."],
        ["LIB0030","Technical Communication","Mike Markel","Communication",None,3,"Shelf G1-Row 2","9781319058258","Technical writing and professional communication guide."],
        ["LIB0031","The Pragmatic Programmer","Hunt, Thomas","Software Engineering","D01",2,"Shelf A3-Row 3","9780135957059","Essential reading for every professional developer."],
        ["LIB0032","Discrete Mathematics","Kenneth Rosen","Mathematics","D01",3,"Shelf A4-Row 2","9780073383095","Standard discrete mathematics textbook for CS programs."],
        ["LIB0033","Computer Vision","Szeliski","Computer Vision","D02",2,"Shelf B3-Row 2","9781848829343","Comprehensive computer vision algorithms reference."],
        ["LIB0034","Embedded Systems","Raj Kamal","Embedded Systems","D06",3,"Shelf C3-Row 1","9780070494824","Standard embedded systems design textbook."],
        ["LIB0035","VLSI Design","Neil Weste","VLSI","D06",2,"Shelf C3-Row 2","9780321547996","Standard VLSI design and CMOS reference."],
    ]
    write_csv("campus", "library_books.csv",
        ["book_id","title","author","subject_area","department_id","copies_available","shelf_location","isbn","description"],
        books)

# ---------------------------------------------------------------------------
# ACTIVITIES
# ---------------------------------------------------------------------------

def gen_clubs():
    rows = [
        ["C001","Neural Nexus","technical","Artificial Intelligence and Machine Learning","B03","R040","weekly","Saturday","15:00-17:00","F005","STU0001","neuralnexus@sce.edu","PROC05","Neural Nexus is the AI and Machine Learning club of the college. Members work on AI projects, attend paper reading sessions, participate in hackathons, and organize workshops on deep learning, computer vision, and NLP. Open to all departments."],
        ["C002","CodeForge","technical","Competitive Programming and Software Development","B01","R019","weekly","Friday","15:00-17:00","F003","STU0002","codeforge@sce.edu","PROC05","CodeForge is the competitive programming and development club. Members participate in coding contests (LeetCode, Codeforces), build open-source projects, and organize internal hackathons. Regular DSA bootcamps are conducted."],
        ["C003","CircuitSphere","technical","Electronics and Embedded Systems","B02","R030","biweekly","Saturday","14:00-16:00","F014","STU0003","circuitsphere@sce.edu","PROC05","CircuitSphere is the electronics and embedded systems club for ECE and EEE students. Activities include Arduino projects, PCB design workshops, robotics mini-projects, and participation in national electronics competitions."],
        ["C004","RoboWorks","technical","Robotics and Automation","B05","R048","weekly","Saturday","10:00-13:00","F023","STU0004","roboworks@sce.edu","PROC05","RoboWorks is the robotics club that designs and builds autonomous robots. Members participate in national-level robotics competitions, Robocon, and organize robot-building workshops for freshers."],
        ["C005","Innovators Guild","innovation","Startup and Entrepreneurship","B03","R038","monthly","Last Saturday","14:00-17:00","F010","STU0005","innovators@sce.edu","PROC05","The Innovators Guild is the college entrepreneurship club. Activities include startup pitch sessions, business model workshops, mentor talks by industry leaders, and participation in startup competitions."],
        ["C006","Cyber Sentinels","technical","Cybersecurity and Ethical Hacking","B01","R020","weekly","Wednesday","16:00-18:00","F021","STU0006","cybersentinels@sce.edu","PROC05","Cyber Sentinels is the cybersecurity club. Members practice ethical hacking, CTF (Capture the Flag) competitions, penetration testing, and organize awareness sessions on digital safety."],
        ["C007","Pixel Studio","creative","Design and UI/UX","B03","R035","weekly","Thursday","15:00-17:00","F007","STU0007","pixelstudio@sce.edu","PROC05","Pixel Studio is the design and UI/UX club. Members work with Figma, Adobe XD, and Illustrator to create digital designs, college posters, and user interface prototypes. Open to all students."],
        ["C008","Data Mavericks","technical","Data Science and Analytics","B03","R036","weekly","Saturday","15:00-17:00","F008","STU0008","datamavericks@sce.edu","PROC05","Data Mavericks is the data science club. Members work on Kaggle competitions, data visualization projects, and learn SQL, Python, and BI tools like Tableau and Power BI."],
        ["C009","Eco Builders","social","Sustainability and Environment","B03","R038","monthly","First Saturday","10:00-12:00","F012","STU0009","ecobuilders@sce.edu","PROC05","Eco Builders is the campus environment club. Activities include tree planting drives, e-waste awareness campaigns, and green campus initiatives."],
        ["C010","SpeakUp Forum","communication","Public Speaking and Debate","B01","R021","biweekly","Saturday","14:00-16:00","F001","STU0010","speakup@sce.edu","PROC05","SpeakUp Forum is the public speaking and debate club. Regular activities include group discussions, extempore speaking, debate competitions, and JAM (Just A Minute) sessions."],
        ["C011","Ignite Motors","technical","Automobile Engineering","B04","R046","monthly","Last Saturday","10:00-13:00","F025","STU0011","ignite.motors@sce.edu","PROC05","Ignite Motors is the automobile engineering club for ME students. Members build go-karts, work on BAJA SAE designs, and organize automobile workshops."],
        ["C012","AeroVision","technical","Drone and UAV Technology","B02","R029","monthly","Second Saturday","14:00-17:00","F016","STU0012","aerovision@sce.edu","PROC05","AeroVision is the drone and UAV club. Members build and fly drones, participate in drone racing competitions, and learn about aerial photography and drone regulations."],
    ]
    write_csv("activities", "clubs.csv",
        ["club_id","club_name","category","focus_area","meeting_building_id","meeting_room_id","meeting_frequency","meeting_day","meeting_time","coordinator_faculty_id","lead_student_id","contact_email","registration_process_id","description"],
        rows)
    return {r[0] for r in rows}

def gen_events():
    rows = [
        ["EVT001","Freshers Orientation 2026","Welcome orientation for all first-year students of the 2026 batch. The program includes address by the Principal, department introductions, campus tour guidance, and an interactive Q&A session with senior students.","orientation","R021","B01","2026-07-16","2026-07-17","09:00","17:00","2026-07-14","D01","","all",0,"completed","2026-07-01"],
        ["EVT002","AI Hackathon 2026","24-hour inter-college AI hackathon organized by the AIML department. Teams of 2–4 will build AI-powered solutions for real-world problems. Cash prizes worth Rs. 50,000. Open to all engineering students.","hackathon","R038","B03","2026-08-20","2026-08-21","09:00","09:00","2026-08-10","D02","","all",200,"upcoming","2026-07-10"],
        ["EVT003","Project Expo 2026","Annual student project exhibition where teams from all departments showcase their mini and final-year projects. Industry judges evaluate projects. Open to college and public visitors.","competition","R048","B05","2026-09-12","2026-09-12","09:00","17:00","2026-09-05","D01","","all",0,"upcoming","2026-07-10"],
        ["EVT004","Core Tech Symposium","Inter-college technical symposium organized by ECE, EEE, ICE, and IT departments. Events include paper presentations, circuit debugging, and technical quizzes.","symposium","R038","B03","2026-09-20","2026-09-20","09:00","17:00","2026-09-12","D06","","all",100,"upcoming","2026-07-10"],
        ["EVT005","Circuit Workshop","Hands-on Arduino and embedded systems workshop for second and third-year ECE students. Participants will build a working IoT project in one day.","workshop","R030","B02","2026-08-14","2026-08-14","09:00","17:00","2026-08-08","D06","C003","all",100,"upcoming","2026-07-10"],
        ["EVT006","Mechanical Symposium — MechFest 2026","Annual mechanical engineering symposium conducted in the ME Workshop. Events include paper presentations, technical quizzes, and model fabrication contests.","symposium","R049","B05","2026-10-10","2026-10-10","09:00","17:00","2026-10-01","D10","","all",50,"upcoming","2026-07-10"],
        ["EVT007","Annual Tech Fest — Techno 2026","College-wide inter-departmental technical festival with events in coding, electronics, robotics, design, and innovation. 3-day event with external college participation.","fest","R049","B05","2026-10-25","2026-10-27","09:00","20:00","2026-10-15","D01","","all",150,"upcoming","2026-07-12"],
        ["EVT008","Placement Training — Resume Writing","Workshop on professional resume writing and LinkedIn optimization for final-year students. Conducted by the Placement Cell.","workshop","R021","B01","2026-08-02","2026-08-02","10:00","13:00","2026-07-30","","","IV",0,"upcoming","2026-07-10"],
        ["EVT009","General Conference 2026","College-wide general conference with keynote speakers from industry and academia discussing emerging technologies and career opportunities.","conference","R038","B03","2026-09-05","2026-09-05","09:00","17:00","2026-08-28","D01","","all",0,"upcoming","2026-07-10"],
        ["EVT010","Data Science Bootcamp","Intensive 3-day bootcamp on data science using Python. Topics include pandas, NumPy, scikit-learn, and real dataset case studies. Organized by Data Mavericks club.","workshop","R036","B03","2026-08-22","2026-08-24","09:00","17:00","2026-08-15","D03","C008","all",300,"upcoming","2026-07-12"],
        ["EVT011","Cybersecurity Awareness Workshop","Half-day workshop on digital safety, phishing prevention, password hygiene, and ethical hacking basics. Open to all students.","workshop","R021","B01","2026-08-28","2026-08-28","10:00","13:00","2026-08-25","D09","C006","all",0,"upcoming","2026-07-12"],
        ["EVT012","Sports Meet 2026","Annual inter-department sports meet. Events include cricket, football, volleyball, basketball, athletics, chess, and carrom. Department-wise participation required.","sports","","B07","2026-11-15","2026-11-17","07:00","18:00","2026-11-01","D01","","all",0,"upcoming","2026-07-12"],
        ["EVT013","Library Week 2026","Week-long book exhibition, reading challenges, and library awareness activities organized by the Library Office.","seminar","R010","B01","2026-09-01","2026-09-06","09:00","17:00","","","","all",0,"upcoming","2026-07-12"],
        ["EVT014","Entrepreneurship Conclave","Panel discussion and pitch session featuring alumni entrepreneurs and startup mentors. Organized by Innovators Guild.","seminar","R021","B01","2026-08-30","2026-08-30","10:00","16:00","2026-08-25","","C005","all",0,"upcoming","2026-07-12"],
        ["EVT015","Placement Drive — Infosys","On-campus placement drive by Infosys for final-year students from CSE, IT, AIML, AIDS, and CSBS departments.","competition","R021","B01","2026-10-05","2026-10-05","09:00","17:00","2026-09-25","D01","","IV",0,"upcoming","2026-07-12"],
    ]
    write_csv("activities", "events.csv",
        ["event_id","title","description","event_type","venue_room_id","venue_building_id","start_date","end_date","start_time","end_time","registration_deadline","organizer_department_id","organizer_club_id","eligibility","fee","status","last_updated"],
        rows)
    return {r[0] for r in rows}

def gen_placement():
    rows = [
        ["PLC01","Infosys","2026-10-05",6.0,3.6,4.5,"2026-09-25","Infosys recruitment process includes an online aptitude test (InfyTQ certification preferred), technical interview covering DSA and OOPS, and HR interview. Process is 1-day on campus.","CON04","upcoming","2026-07-12"],
        ["PLC02","TCS","2026-10-15",6.0,3.36,5.0,"2026-10-05","TCS recruitment consists of TCS NQT (National Qualifier Test) online, followed by technical and managerial interviews for shortlisted candidates.","CON04","upcoming","2026-07-12"],
        ["PLC03","Wipro","2026-10-22",6.5,3.5,4.0,"2026-10-12","Wipro recruitment includes an aptitude test (NLTH test), technical test, technical interview, and HR round. Dress code is formals.","CON04","upcoming","2026-07-12"],
        ["PLC04","HCL Technologies","2026-11-02",6.0,3.25,4.5,"2026-10-25","HCL recruitment includes online aptitude, technical interview, and HR round. Offers graduate engineer trainee roles.","CON04","upcoming","2026-07-12"],
        ["PLC05","Cognizant","2026-11-12",6.0,4.0,5.5,"2026-11-01","Cognizant GenC programme includes aptitude, coding test, technical interview, and HR interview. Programming knowledge in Java or Python required.","CON04","upcoming","2026-07-12"],
    ]
    write_csv("activities", "placement_drives.csv",
        ["drive_id","company_name","drive_date","min_cgpa","package_lpa_min","package_lpa_max","registration_deadline","process_description","tpo_contact_id","status","last_updated"],
        rows)

def gen_placement_eligibility():
    rows = [
        ["PLC01","D01"],["PLC01","D02"],["PLC01","D03"],["PLC01","D04"],["PLC01","D09"],
        ["PLC02","D01"],["PLC02","D02"],["PLC02","D03"],["PLC02","D04"],["PLC02","D09"],
        ["PLC03","D01"],["PLC03","D06"],["PLC03","D07"],["PLC03","D09"],["PLC03","D10"],
        ["PLC04","D01"],["PLC04","D06"],["PLC04","D07"],["PLC04","D08"],["PLC04","D10"],
        ["PLC05","D01"],["PLC05","D02"],["PLC05","D03"],["PLC05","D09"],
    ]
    write_csv("junction", "placement_drive_eligibility.csv",
        ["drive_id","department_id"],
        rows)

# ---------------------------------------------------------------------------
# SERVICES
# ---------------------------------------------------------------------------

def gen_registration_process():
    rows = [
        ["PROC01","Hackathon Registration","Student ID card, college email confirmation","Faculty Coordinator Approval","OFF09","B01",200,"https://forms.sce.edu/hackathon","open",1,"To register for a college hackathon: collect the event form from the organizing department or complete the online form. Get faculty approval and submit with student ID and fee receipt (if applicable).","2026-07-01"],
        ["PROC02","Club Registration","Student ID card","Club Coordinator Approval","OFF09","B03",0,"https://forms.sce.edu/clubs","open",2,"To join a club: attend the club's open house session (usually during the first two weeks of the semester), fill the club registration form, and get approval from the faculty coordinator. No fee for most clubs.","2026-07-01"],
        ["PROC03","Library Membership","Student ID card, department letter","Library Verification","OFF07","B01",0,"https://forms.sce.edu/library","open",1,"Library membership is automatically activated when you enroll. Visit the Library Office (first floor, RV Block) with your student ID to collect your library card and activate borrowing privileges.","2026-07-01"],
        ["PROC04","Bus Pass Application","Student ID, fee receipt, address proof","Transport Office Approval","OFF08","B01",400,"https://forms.sce.edu/buspass","open",3,"Apply for a bus pass at the Transport Office (ground floor, RV Block). Submit the application with address proof and fee receipt. Pass is issued within 3 working days.","2026-07-01"],
        ["PROC05","Hostel Admission","Admission letter, parent signature, medical certificate","Warden Approval","OFF02","B09",0,"https://forms.sce.edu/hostel","seasonal",5,"Hostel applications are processed before semester start. Fill the online form, pay the hostel fee at Accounts Office, and report to the warden with all documents. Rooms are allotted on a first-come first-served basis.","2026-07-01"],
        ["PROC06","Semester Fee Payment","Student ID card","Receipt Generation","OFF03","B01",0,"https://fees.sce.edu","open",1,"Pay semester fees online at fees.sce.edu or in person at the Accounts Office (ground floor, RV Block). Online payment via net banking, UPI, or debit card. Collect the receipt after payment.","2026-07-01"],
        ["PROC07","Bonafide Certificate","Student ID card, purpose letter","Administrative Office Approval","OFF02","B01",0,"https://forms.sce.edu/bonafide","open",2,"Apply for a Bonafide Certificate at the Administrative Office (ground floor, RV Block) online or in person. Mention the purpose (bank loan, scholarship, visa). The certificate is ready in 2 working days.","2026-07-01"],
        ["PROC08","OD Request","Event proof, HOD permission letter","HOD Approval","OFF09","B01",0,"","open",1,"To apply for an On-Duty (OD) request: submit an OD form along with the event invitation/participation proof to your department HOD office at least 2 days before the event.","2026-07-01"],
        ["PROC09","Leave Application","Parent/guardian letter (for prolonged leave)","Advisor/HOD Approval","OFF09","B01",0,"","open",1,"Submit a leave application to your class advisor or HOD office. For leave exceeding 3 days, a parent letter is required. Online submission available through the student portal.","2026-07-01"],
        ["PROC10","Transcript Request","Fee receipt (Rs. 200 per copy)","Exam Cell Approval","OFF04","B01",200,"https://forms.sce.edu/transcript","open",5,"Apply for official transcripts at the Exam Cell (first floor, RV Block). Submit the application with fee payment receipt. Transcripts are ready within 5 working days. Additional charges apply for express processing.","2026-07-01"],
    ]
    write_csv("services", "registration_process.csv",
        ["process_id","process_name","documents_required","approval_authority","office_id","building_id","fee_amount","online_form_url","availability","turnaround_days","description","last_updated"],
        rows)
    return {r[0] for r in rows}

def gen_registration_steps():
    steps = {
        "PROC01":[
            "Visit the event page or department notice board to find the registration form link.",
            "Fill in your student details, team details (if team event), and project idea summary.",
            "Submit the form to your faculty coordinator for approval.",
            "Pay the registration fee (if applicable) at the Accounts Office and attach the receipt.",
            "Collect your registration confirmation slip from the organizing department.",
        ],
        "PROC02":[
            "Attend the club open house session held in the first two weeks of semester.",
            "Pick up a club registration form from the club coordinator or download from the college portal.",
            "Fill in your details, area of interest, and prior experience.",
            "Submit the form to the faculty coordinator and get their signature.",
            "Your name will be added to the club roster. You will receive meeting schedule via email.",
        ],
        "PROC03":[
            "Visit the Library Office on the first floor of RV Block.",
            "Present your student ID card.",
            "Collect your library membership card from the librarian.",
            "You can now borrow up to 3 books at a time for a period of 14 days.",
        ],
        "PROC04":[
            "Visit the Transport Office on the ground floor of RV Block.",
            "Collect the bus pass application form.",
            "Fill in your residential address and select your bus route.",
            "Pay the bus pass fee at the Accounts Office and collect the fee receipt.",
            "Submit the form with the fee receipt and your student ID at the Transport Office.",
            "Collect your bus pass within 3 working days.",
        ],
        "PROC05":[
            "Fill the hostel application form online at forms.sce.edu/hostel before the deadline.",
            "Pay the hostel fee at the Accounts Office and collect the payment receipt.",
            "Report to the Hostel Complex on the allotment date with admission letter, parent letter, medical certificate, and fee receipt.",
            "Collect room keys from the warden after document verification.",
            "Sign the hostel rules agreement form.",
        ],
        "PROC06":[
            "Log in to fees.sce.edu with your register number.",
            "Select the current semester and verify the fee amount.",
            "Pay online via UPI, net banking, or debit card. OR visit the Accounts Office (ground floor, RV Block) for cash/DD payment.",
            "Download and save the payment receipt.",
        ],
        "PROC07":[
            "Visit the Administrative Office on the ground floor of RV Block, or apply online at forms.sce.edu/bonafide.",
            "State the purpose of the Bonafide Certificate (e.g., bank loan, scholarship application, visa).",
            "Submit your student ID and purpose letter.",
            "The certificate will be ready in 2 working days. Collect it from the Administrative Office.",
        ],
        "PROC08":[
            "Obtain the official event invitation letter or participation proof.",
            "Fill the OD request form available at your department HOD office.",
            "Attach the event proof and submit to your HOD at least 2 days before the event.",
            "Collect the approved OD letter from the HOD office before the event date.",
        ],
        "PROC09":[
            "Inform your class advisor about the reason for leave.",
            "Fill the leave application form (available at department office or student portal).",
            "For leave exceeding 3 days, attach a parent/guardian letter.",
            "Submit the form to your class advisor for approval.",
            "The approved leave will be updated in the attendance register.",
        ],
        "PROC10":[
            "Visit the Exam Cell on the first floor of RV Block.",
            "Fill the transcript request form specifying the number of copies.",
            "Pay Rs. 200 per copy at the Accounts Office and collect the receipt.",
            "Submit the form and receipt at the Exam Cell.",
            "Transcripts will be ready in 5 working days. Collect with your student ID.",
        ],
    }
    rows = []
    for proc_id, step_list in steps.items():
        for i, instruction in enumerate(step_list, 1):
            rows.append([proc_id, i, instruction])
    write_csv("junction", "registration_steps.csv",
        ["process_id","step_number","instruction"],
        rows)

def gen_campus_services():
    rows = [
        ["SVC01","ID Card Issue","OFF02","B01","PROC07",0,"2-3 working days","Student ID card. Apply at Administrative Office. Bring admission confirmation letter.","ID cards are issued by the Administrative Office, RV Block ground floor. New students receive their ID during orientation. Replacement cards cost Rs. 100."],
        ["SVC02","Fee Payment","OFF03","B01","PROC06",0,"Immediate","Student ID, fee challan.","Semester fees are paid at the Accounts Office, RV Block ground floor. Online payment also available at fees.sce.edu."],
        ["SVC03","Bonafide Certificate","OFF02","B01","PROC07",0,"2 working days","Student ID, purpose letter.","Bonafide Certificates are issued by the Administrative Office. Used for bank loans, scholarships, and visa applications."],
        ["SVC04","Transcript","OFF04","B01","PROC10",200,"5 working days","Fee receipt, student ID.","Official transcripts are issued by the Exam Cell, RV Block first floor. Required for higher education applications and job offers."],
        ["SVC05","Placement Support","OFF05","B01","",0,"Ongoing","Student ID, updated resume.","Placement Cell (first floor, RV Block) provides interview preparation, resume reviews, and coordinates campus placement drives."],
        ["SVC06","Library Services","OFF07","B01","PROC03",0,"Immediate","Library card, student ID.","Library borrowing, renewal, and digital resource access through the Library Office, first floor RV Block."],
        ["SVC07","Internet and WiFi Support","OFF11","B01","",0,"Immediate","Student ID, register number.","IT Support Desk (second floor, RV Block) helps with WiFi connectivity, college email setup, LMS access, and student portal login issues."],
        ["SVC08","Bus Pass","OFF08","B01","PROC04",400,"3 working days","Student ID, address proof, fee receipt.","Bus passes are issued by the Transport Office, RV Block ground floor. Monthly fee varies by route."],
        ["SVC09","Lost and Found","OFF02","B01","",0,"Immediate","Owner identification.","Report lost items at the Administrative Office. Recovered items are stored for 30 days before disposal."],
        ["SVC10","OD Certificate","OFF09","B01","PROC08",0,"1 working day","Event proof, student ID.","On-Duty certificates are approved by the HOD office and available for students participating in external academic events."],
    ]
    write_csv("services", "campus_services.csv",
        ["service_id","service_name","provider_office_id","building_id","process_id","fee_amount","processing_time","required_documents","description"],
        rows)

def gen_contacts():
    rows = [
        ["CON01","office","OFF01","Principal Office","principal@sce.edu","+91-9876540201","no","Contact the Principal Office for academic grievances, policy matters, and escalated student concerns."],
        ["CON02","office","OFF02","Administrative Office","admin@sce.edu","+91-9876540202","no","Contact the Administrative Office for ID cards, bonafide certificates, and general student records."],
        ["CON03","office","OFF03","Accounts Office","accounts@sce.edu","+91-9876540203","no","Contact the Accounts Office for fee payment, receipts, and scholarship disbursement."],
        ["CON04","office","OFF05","Placement Cell","placement@sce.edu","+91-9876540205","no","Contact the Placement Cell for campus recruitment, internships, and career guidance."],
        ["CON05","office","OFF04","Exam Cell","examcell@sce.edu","+91-9876540204","no","Contact the Exam Cell for exam schedules, hall tickets, results, and transcript requests."],
        ["CON06","office","OFF07","Library Office","library@sce.edu","+91-9876540206","no","Contact the Library for membership, book queries, and digital resource access."],
        ["CON07","office","OFF08","Transport Office","transport@sce.edu","+91-9876540207","no","Contact the Transport Office for bus pass applications and route information."],
        ["CON08","emergency","","Campus Security","security@sce.edu","+91-9876540100","yes","24x7 campus security. Call immediately for any safety emergency on campus."],
        ["CON09","emergency","","Anti-Ragging Helpline","antiragging@sce.edu","1800-180-5522","yes","National anti-ragging helpline. Available 24x7. All complaints are treated confidentially."],
        ["CON10","office","OFF11","IT Support Desk","itsupport@sce.edu","+91-9876540210","no","IT Support for WiFi, email, LMS, and student portal issues."],
        ["CON11","office","OFF06","Admission Cell","admissions@sce.edu","+91-9876540208","no","Contact Admissions for enrollment, document verification, and lateral entry queries."],
        ["CON12","facility","FAC03","Medical Room","medical@sce.edu","+91-9876540209","yes","Campus medical room. Contact for health emergencies during college hours."],
    ]
    write_csv("services", "contacts.csv",
        ["contact_id","entity_type","entity_id","entity_name","email","phone","is_emergency","description"],
        rows)

def gen_forms():
    rows = [
        ["FRM01","Bus Pass Application Form","PROC04","https://forms.sce.edu/buspass","OFF08","Standard form to apply for a college bus pass. Available at the Transport Office and online.","2026-07-01"],
        ["FRM02","Hostel Application Form","PROC05","https://forms.sce.edu/hostel","OFF02","Form to apply for on-campus hostel accommodation. Fill online and submit with documents to the hostel warden.","2026-07-01"],
        ["FRM03","Bonafide Certificate Request","PROC07","https://forms.sce.edu/bonafide","OFF02","Online form to request a Bonafide Certificate from the Administrative Office.","2026-07-01"],
        ["FRM04","Transcript Request Form","PROC10","https://forms.sce.edu/transcript","OFF04","Form to request official academic transcripts from the Exam Cell.","2026-07-01"],
        ["FRM05","Library Membership Form","PROC03","https://forms.sce.edu/library","OFF07","Form to activate library membership and collect library card.","2026-07-01"],
        ["FRM06","OD Request Form","PROC08","https://forms.sce.edu/od","OFF09","Form to request On-Duty certificate for external academic events.","2026-07-01"],
        ["FRM07","Leave Application Form","PROC09","https://forms.sce.edu/leave","OFF09","Standard leave application form. Available at department office and student portal.","2026-07-01"],
        ["FRM08","Club Registration Form","PROC02","https://forms.sce.edu/clubs","OFF09","Form to join a college club. Obtain from the club coordinator or download online.","2026-07-01"],
    ]
    write_csv("services", "forms.csv",
        ["form_id","form_name","related_process_id","download_url","submission_office_id","description","last_updated"],
        rows)

def gen_student_support():
    rows = [
        ["SUP01","grievance","Student Grievance Cell","Dr. V. Ramachandran (Principal)","9876540201","principal@sce.edu","B01","R001","Mon-Fri 09:00-17:00","The Student Grievance Cell is headed by the Principal. Students can submit written complaints about academic, administrative, or personal grievances. All complaints are addressed within 7 working days."],
        ["SUP02","anti_ragging","Anti-Ragging Committee","Dr. S. Ganesh (Anti-Ragging Coordinator)","1800-180-5522","antiragging@sce.edu","B01","R001","24x7","The Anti-Ragging Committee is a zero-tolerance body. Any act of ragging must be reported immediately. Helpline is available 24x7. Complaints are strictly confidential."],
        ["SUP03","counseling","Student Counseling Centre","Ms. A. Preethi (Counselor)","9876540250","counseling@sce.edu","B01","R002","Mon-Fri 09:00-17:00","Free counseling services are available for all students. Sessions cover academic stress, career confusion, personal challenges, and mental health support. Appointments can be booked through the student portal."],
        ["SUP04","medical","Medical Room","Campus Nurse","9876540209","medical@sce.edu","B01","R006","Mon-Fri 09:00-16:00","First-aid and basic health services are provided at the Medical Room on the ground floor of RV Block. Students with emergencies are referred to the nearest government hospital."],
        ["SUP05","security","Campus Security","Mr. J. Arumugam (Security Head)","9876540100","security@sce.edu","B06","","24x7","Campus security operates 24x7. Security personnel are stationed at the Main Gate, hostel complex, and all academic blocks. Report safety concerns or suspicious activity immediately."],
        ["SUP06","women_cell","Women's Grievance Cell","Dr. D. Srinivasan (Women's Cell Chair)","9876540255","womenscell@sce.edu","B01","R002","Mon-Fri 09:00-17:00","The Women's Grievance Cell addresses issues of harassment, discrimination, and safety concerns faced by female students and staff. All complaints are handled with strict confidentiality."],
    ]
    write_csv("services", "student_support.csv",
        ["support_id","service_type","service_name","contact_name","phone","email","building_id","room_id","availability_hours","description"],
        rows)

def gen_it_onboarding():
    rows = [
        ["ITO01","Campus WiFi","CON10","Default password is your 10-digit date of birth (DDMMYYYY followed by last 2 digits of register number). Change on first login.","https://wifi.sce.edu/reset","Campus WiFi is available across all academic blocks (RV, KS, BD, ME). Network name: SCE_CAMPUS. Login with your register number and default password. Speed: 100 Mbps shared. For issues, contact IT Support Desk, second floor RV Block."],
        ["ITO02","College Email","CON10","Your college email is firstname.registernumber@student.sce.edu. Default password is your register number. Change immediately after first login.","https://mail.sce.edu/reset","Every student receives an official college email ID. Format: firstname.registernumber@student.sce.edu. Use this for all official communication, exam cell queries, and placement registrations."],
        ["ITO03","LMS Access","CON10","Log in with your register number and date of birth. Your courses are auto-enrolled based on your department and year.","https://lms.sce.edu/reset","The Learning Management System (LMS) at lms.sce.edu contains course materials, assignments, internal marks, and attendance records. Access requires campus WiFi or VPN. Login with register number and date of birth."],
        ["ITO04","Student Portal","CON10","Login: register number. Password: date of birth (DDMMYYYY). Change on first login at portal.sce.edu/profile.","https://portal.sce.edu/reset","The Student Portal at portal.sce.edu provides access to timetables, internal marks, attendance, fee receipts, and academic calendar. Available from any internet connection."],
        ["ITO05","Lab Systems","CON10","Lab PC login uses your register number as username and the lab code as default password (provided by lab instructor on first day).","","Campus computer labs use a centralized login system. Your register number is your username. The default password is provided by the lab instructor during the first lab session. Do not share your credentials."],
    ]
    write_csv("services", "it_onboarding.csv",
        ["onboarding_id","service_name","helpdesk_contact_id","default_credentials","reset_url","description"],
        rows)
    return {r[0] for r in rows}

def gen_it_onboarding_steps(it_ids):
    steps = {
        "ITO01":[
            "Open WiFi settings on your device and select the network 'SCE_CAMPUS'.",
            "Open a browser. You will be redirected to the SCE WiFi login page.",
            "Enter your register number as username.",
            "Enter your default password (DDMMYYYY + last 2 digits of register number).",
            "Click Login. You will be connected to campus WiFi.",
            "For password reset, visit wifi.sce.edu/reset or contact the IT Support Desk.",
        ],
        "ITO02":[
            "Open mail.sce.edu in your browser.",
            "Enter your college email ID (firstname.registernumber@student.sce.edu).",
            "Enter your default password (register number).",
            "Change your password immediately through Settings > Security.",
            "Set a recovery email or phone number for account recovery.",
        ],
        "ITO03":[
            "Open lms.sce.edu in your browser (works best on campus WiFi).",
            "Click 'Student Login' and enter your register number.",
            "Enter your date of birth (DDMMYYYY) as the default password.",
            "Change your password via Profile Settings.",
            "You will see all your enrolled courses on the dashboard.",
            "For access issues, contact the IT Support Desk.",
        ],
        "ITO04":[
            "Open portal.sce.edu in your browser from any internet connection.",
            "Enter your register number and date of birth (DDMMYYYY) as password.",
            "On first login, change your password and update your profile photo.",
            "Access timetable, attendance, internal marks, and fee receipts from the dashboard.",
        ],
        "ITO05":[
            "Go to a computer lab and sit at any available PC.",
            "Press Ctrl+Alt+Del to see the login screen.",
            "Enter your register number as username.",
            "Enter the lab code provided by your lab instructor as the default password.",
            "Change your password after first login.",
        ],
    }
    rows = []
    for it_id, step_list in steps.items():
        for i, instruction in enumerate(step_list, 1):
            rows.append([it_id, i, instruction])
    write_csv("junction", "it_onboarding_steps.csv",
        ["onboarding_id","step_number","instruction"],
        rows)

def gen_announcements(event_ids):
    rows = [
        ["ANN001","Welcome to the 2026–27 Academic Year","The academic year 2026–27 begins on 15 July 2026. Students are advised to collect their timetables from their respective department offices. Freshers are requested to report to RV Block Seminar Hall for orientation on 16 July.","academic","all","2026-07-10","2026-08-10","high","Principal Office","","2026-07-10"],
        ["ANN002","First Year Orientation — 16 & 17 July 2026","All first-year students must attend the Freshers Orientation on 16 and 17 July 2026 at RV Block Seminar Hall 1 (R021). Attendance is mandatory. Parents are welcome on Day 1 (16 July). College buses will run on both days.","academic","first_year","2026-07-10","2026-07-17","critical","Administrative Office","EVT001","2026-07-10"],
        ["ANN003","Fee Payment Deadline — First Year Students","Fee payment for first-year students must be completed by 31 July 2026. Pay online at fees.sce.edu or at the Accounts Office, ground floor RV Block. Late payment attracts Rs. 100 penalty per day. Bring your admission letter and student ID.","academic","first_year","2026-07-10","2026-07-31","high","Accounts Office","","2026-07-10"],
        ["ANN004","Fee Payment Deadline — II, III and IV Year Students","Returning students must complete fee payment by 5 August 2026. Online payment available at fees.sce.edu. Offline payment accepted at the Accounts Office from 09:00 AM to 05:00 PM.","academic","all","2026-07-10","2026-08-05","high","Accounts Office","","2026-07-10"],
        ["ANN005","AI Hackathon 2026 — Registrations Open","The AIML Department is organizing the AI Hackathon 2026 on 20–21 August 2026. Registration fee: Rs. 200 per team (2–4 members). Last date to register: 10 August 2026. Register at forms.sce.edu/hackathon.","event","all","2026-07-15","2026-08-10","medium","AIML Department","EVT002","2026-07-15"],
        ["ANN006","Club Registrations Open — 2026–27","College clubs are now accepting registrations for the academic year 2026–27. Visit the respective club booths at the college foyer during the first two weeks of semester. No fee for most clubs. Complete list at portal.sce.edu/clubs.","academic","all","2026-07-15","2026-08-10","medium","Dean of Student Affairs","","2026-07-15"],
        ["ANN007","Internal Assessment 1 — August 25 to September 5","Internal Assessment 1 examinations for all departments will be conducted from 25 August to 5 September 2026. Subject-wise schedule will be published by the Exam Cell by 15 August. Students are advised to register for the CIA portal by 10 August.","exam","all","2026-07-20","2026-09-05","high","Exam Cell","","2026-07-20"],
        ["ANN008","Library Week 2026 — September 1 to 6","The Central Library is organizing Library Week from 1–6 September 2026. Events include book exhibitions, reading challenges, author talks, and library quiz. All students are welcome. No registration required.","library","all","2026-08-20","2026-09-06","low","Library Office","EVT013","2026-08-20"],
        ["ANN009","Project Expo 2026 — Abstract Submission","Third and final-year students are invited to submit project abstracts for Project Expo 2026 (12 September 2026). Abstracts must be submitted through the college portal by 5 September. Maximum team size: 4.","event","all","2026-08-15","2026-09-05","medium","CSE Department","EVT003","2026-08-15"],
        ["ANN010","Placement Drive — Infosys — October 5","Infosys will conduct an on-campus placement drive on 5 October 2026 for final-year students from CSE, IT, AIML, AIDS, and CSBS. Minimum CGPA: 6.0. Register at the Placement Cell by 25 September with your updated resume.","placement","IV","2026-09-10","2026-09-25","high","Placement Cell","EVT015","2026-09-10"],
        ["ANN011","Independence Day Holiday — 15 August 2026","The college will remain closed on 15 August 2026 (Independence Day). However, the flag hoisting ceremony will be conducted on campus at 8:00 AM. Hostel students and NCC/NSS members are encouraged to attend.","general","all","2026-08-10","2026-08-15","medium","Principal Office","","2026-08-10"],
        ["ANN012","WiFi Login Issue — Resolved","The campus WiFi login issue reported on 12 July has been resolved. Students should now be able to log in with their register number. If you still face issues, visit the IT Support Desk on the second floor of RV Block or call +91-9876540210.","general","all","2026-07-13","2026-07-20","low","IT Support Desk","","2026-07-13"],
        ["ANN013","Dussehra Holidays — October 1 to 5","The college will be closed from 1–5 October 2026 for Dussehra. Hostel students may remain on campus. Mess will operate during the holidays. Academic activities resume on 6 October 2026.","general","all","2026-09-20","2026-10-05","medium","Administrative Office","","2026-09-20"],
        ["ANN014","Anti-Ragging Declaration — Mandatory for All Students","All students (new and returning) must complete the Anti-Ragging online declaration at antiragging.in by 25 July 2026. Failure to submit will result in withholding of hall tickets and certificates. Parents must also sign the declaration.","general","all","2026-07-10","2026-07-25","critical","Anti-Ragging Committee","","2026-07-10"],
        ["ANN015","Sports Meet 2026 — Department Registrations Open","The Annual Sports Meet 2026 will be held from 15–17 November 2026 at the Sports Ground. Events include cricket, football, volleyball, athletics, and indoor games. Register your department team through your class representative by 1 November.","sports","all","2026-10-15","2026-11-01","medium","Physical Education Department","EVT012","2026-10-15"],
    ]
    write_csv("services", "announcements.csv",
        ["announcement_id","title","description","category","target_audience","publish_date","expiry_date","priority","posted_by","related_event_id","last_updated"],
        rows)

# ---------------------------------------------------------------------------
# REFERENCE
# ---------------------------------------------------------------------------

def gen_id_mapping():
    rows = [
        ["MAP01","B01","RV Block","RV","Main Block"],
        ["MAP02","B01","RV Block","RV","Administration Block"],
        ["MAP03","B02","KS Block","KS","Engineering Block"],
        ["MAP04","B03","BD Block","BD","JS-CH Block"],
        ["MAP05","B03","BD Block","BD","AIML Block"],
        ["MAP06","B04","ME Block","ME","Mechanical Block"],
        ["MAP07","B05","ME Workshop","MEW","Workshop Block"],
        ["MAP08","B06","Main Gate","MG","College Gate"],
        ["MAP09","B07","Sports Ground","SG","Ground"],
        ["MAP10","B08","Canteen Block","CB","Canteen Area"],
        ["MAP11","B09","Hostel Complex","HC","Hostel"],
    ]
    write_csv("reference", "id_mapping.csv",
        ["mapping_id","building_id","canonical_name","block_code","alternate_name"],
        rows)

def gen_aliases():
    rows = [
        # Buildings
        ["ALI0001","building","B01","Main Block","casual"],
        ["ALI0002","building","B01","Administration Block","casual"],
        ["ALI0003","building","B01","Admin Block","abbreviation"],
        ["ALI0004","building","B02","Engineering Block","casual"],
        ["ALI0005","building","B02","KS","abbreviation"],
        ["ALI0006","building","B03","JS-CH","alternate"],
        ["ALI0007","building","B03","AIML Block","casual"],
        ["ALI0008","building","B03","BD","abbreviation"],
        ["ALI0009","building","B04","Mech Block","casual"],
        ["ALI0010","building","B04","ME","abbreviation"],
        ["ALI0011","building","B05","Workshop","casual"],
        ["ALI0012","building","B06","College Gate","casual"],
        ["ALI0013","building","B07","Ground","casual"],
        ["ALI0014","building","B08","Canteen","casual"],
        ["ALI0015","building","B09","Hostel","casual"],
        # Departments
        ["ALI0016","department","D01","Computer Science","casual"],
        ["ALI0017","department","D01","Comp Sci","casual"],
        ["ALI0018","department","D01","Computer Science and Engineering","full_name"],
        ["ALI0019","department","D02","Artificial Intelligence and Machine Learning","full_name"],
        ["ALI0020","department","D02","AI ML","casual"],
        ["ALI0021","department","D02","AI and ML","casual"],
        ["ALI0022","department","D03","Artificial Intelligence and Data Science","full_name"],
        ["ALI0023","department","D03","AI DS","casual"],
        ["ALI0024","department","D04","Computer Science and Business Systems","full_name"],
        ["ALI0025","department","D05","Civil","casual"],
        ["ALI0026","department","D05","Civil Engineering","full_name"],
        ["ALI0027","department","D06","Electronics","casual"],
        ["ALI0028","department","D06","ECE","abbreviation"],
        ["ALI0029","department","D06","Electronics and Communication Engineering","full_name"],
        ["ALI0030","department","D07","Electrical","casual"],
        ["ALI0031","department","D07","Electrical and Electronics Engineering","full_name"],
        ["ALI0032","department","D08","Instrumentation and Control Engineering","full_name"],
        ["ALI0033","department","D08","ICE","abbreviation"],
        ["ALI0034","department","D08","Instrumentation","casual"],
        ["ALI0035","department","D09","IT","abbreviation"],
        ["ALI0036","department","D09","Information Technology","full_name"],
        ["ALI0037","department","D10","Mechanical","casual"],
        ["ALI0038","department","D10","Mech","abbreviation"],
        ["ALI0039","department","D10","Mechanical Engineering","full_name"],
        # Clubs
        ["ALI0040","club","C001","AI Club","casual"],
        ["ALI0041","club","C001","Machine Learning Club","casual"],
        ["ALI0042","club","C002","Coding Club","casual"],
        ["ALI0043","club","C002","Programming Club","casual"],
        ["ALI0044","club","C003","Electronics Club","casual"],
        ["ALI0045","club","C003","Circuit Club","casual"],
        ["ALI0046","club","C004","Robotics Club","casual"],
        ["ALI0047","club","C005","Startup Club","casual"],
        ["ALI0048","club","C005","Entrepreneurship Club","casual"],
        ["ALI0049","club","C006","Hacking Club","casual"],
        ["ALI0050","club","C006","Cyber Club","casual"],
        ["ALI0051","club","C007","Design Club","casual"],
        ["ALI0052","club","C007","UI UX Club","casual"],
        ["ALI0053","club","C008","Data Club","casual"],
        ["ALI0054","club","C009","Environment Club","casual"],
        ["ALI0055","club","C009","Green Club","casual"],
        ["ALI0056","club","C010","Speaking Club","casual"],
        ["ALI0057","club","C010","Debate Club","casual"],
        ["ALI0058","club","C011","Automobile Club","casual"],
        ["ALI0059","club","C012","Drone Club","casual"],
        ["ALI0060","club","C012","UAV Club","casual"],
        # Offices
        ["ALI0061","office","OFF01","Principal's Office","casual"],
        ["ALI0062","office","OFF02","Admin Office","abbreviation"],
        ["ALI0063","office","OFF04","Examination Cell","full_name"],
        ["ALI0064","office","OFF05","Placements Office","casual"],
        ["ALI0065","office","OFF07","Library","casual"],
        ["ALI0066","office","OFF08","Transport","casual"],
        # Facilities
        ["ALI0067","facility","FAC01","Library","casual"],
        ["ALI0068","facility","FAC01","Central Library","full_name"],
        ["ALI0069","facility","FAC02","Canteen","casual"],
        ["ALI0070","facility","FAC03","Medical Room","casual"],
        ["ALI0071","facility","FAC03","Sick Room","casual"],
        ["ALI0072","facility","FAC04","Parking","casual"],
        ["ALI0073","facility","FAC07","Internet","casual"],
        ["ALI0074","facility","FAC07","Campus Network","casual"],
        # Subjects
        ["ALI0075","subject","SUB009","ML","abbreviation"],
        ["ALI0076","subject","SUB009","Machi Learning","casual"],
        ["ALI0077","subject","SUB014","NLP","abbreviation"],
        ["ALI0078","subject","SUB013","DL","abbreviation"],
        ["ALI0079","subject","SUB006","DBMS","abbreviation"],
        ["ALI0080","subject","SUB006","Database","casual"],
        ["ALI0081","subject","SUB007","CN","abbreviation"],
        ["ALI0082","subject","SUB007","Networking","casual"],
        # IT Services
        ["ALI0083","it_onboarding","ITO01","WiFi","casual"],
        ["ALI0084","it_onboarding","ITO01","Internet","casual"],
        ["ALI0085","it_onboarding","ITO02","Email","casual"],
        ["ALI0086","it_onboarding","ITO02","College Mail","casual"],
        ["ALI0087","it_onboarding","ITO03","LMS","abbreviation"],
        ["ALI0088","it_onboarding","ITO03","Learning Management System","full_name"],
        ["ALI0089","it_onboarding","ITO04","Portal","casual"],
        ["ALI0090","it_onboarding","ITO04","Student Portal","casual"],
    ]
    write_csv("reference", "aliases.csv",
        ["alias_id","entity_type","entity_id","alias_name","alias_type"],
        rows)

def gen_keywords():
    rows = [
        # Buildings
        ["KW0001","building","B01","principal office"],["KW0002","building","B01","administrative office"],["KW0003","building","B01","admin"],["KW0004","building","B01","main building"],["KW0005","building","B01","first year"],["KW0006","building","B01","cse classes"],["KW0007","building","B01","exam cell"],["KW0008","building","B01","placement cell"],["KW0009","building","B01","library"],["KW0010","building","B01","accounts"],["KW0011","building","B01","fees"],["KW0012","building","B01","transport office"],["KW0013","building","B01","medical room"],
        ["KW0014","building","B02","ece department"],["KW0015","building","B02","eee department"],["KW0016","building","B02","ice department"],["KW0017","building","B02","it department"],["KW0018","building","B02","electronics lab"],["KW0019","building","B02","engineering block"],
        ["KW0020","building","B03","aiml department"],["KW0021","building","B03","aids department"],["KW0022","building","B03","csbs department"],["KW0023","building","B03","civil department"],["KW0024","building","B03","js-ch"],["KW0025","building","B03","ai lab"],["KW0026","building","B03","data science lab"],["KW0027","building","B03","js block"],
        ["KW0028","building","B04","mechanical department"],["KW0029","building","B04","cad lab"],["KW0030","building","B04","thermodynamics lab"],["KW0031","building","B04","mech block"],
        ["KW0032","building","B05","workshop"],["KW0033","building","B05","symposium"],["KW0034","building","B05","fabrication"],["KW0035","building","B05","tech fest venue"],
        ["KW0036","building","B06","main gate"],["KW0037","building","B06","entrance"],["KW0038","building","B06","bus stop"],["KW0039","building","B06","security"],["KW0040","building","B06","visitor"],
        ["KW0041","building","B07","sports"],["KW0042","building","B07","cricket"],["KW0043","building","B07","football"],["KW0044","building","B07","athletics"],["KW0045","building","B07","sports meet"],
        ["KW0046","building","B08","canteen"],["KW0047","building","B08","food"],["KW0048","building","B08","lunch"],["KW0049","building","B08","breakfast"],["KW0050","building","B08","mess"],
        ["KW0051","building","B09","hostel"],["KW0052","building","B09","warden"],["KW0053","building","B09","accommodation"],["KW0054","building","B09","dormitory"],["KW0055","building","B09","men's hostel"],["KW0056","building","B09","women's hostel"],
        # Departments
        ["KW0057","department","D01","computer science"],["KW0058","department","D01","programming"],["KW0059","department","D01","software"],["KW0060","department","D01","algorithms"],
        ["KW0061","department","D02","artificial intelligence"],["KW0062","department","D02","machine learning"],["KW0063","department","D02","deep learning"],["KW0064","department","D02","neural networks"],
        ["KW0065","department","D03","data science"],["KW0066","department","D03","big data"],["KW0067","department","D03","analytics"],["KW0068","department","D03","python"],
        ["KW0069","department","D04","business systems"],["KW0070","department","D04","erp"],["KW0071","department","D04","management"],
        ["KW0072","department","D05","structural engineering"],["KW0073","department","D05","construction"],["KW0074","department","D05","concrete"],
        ["KW0075","department","D06","electronics"],["KW0076","department","D06","communication"],["KW0077","department","D06","vlsi"],["KW0078","department","D06","embedded systems"],
        ["KW0079","department","D07","electrical machines"],["KW0080","department","D07","power systems"],["KW0081","department","D07","transformers"],
        ["KW0082","department","D08","instrumentation"],["KW0083","department","D08","process control"],["KW0084","department","D08","plc"],["KW0085","department","D08","scada"],
        ["KW0086","department","D09","networking"],["KW0087","department","D09","cloud computing"],["KW0088","department","D09","cybersecurity"],["KW0089","department","D09","web development"],
        ["KW0090","department","D10","thermodynamics"],["KW0091","department","D10","fluid mechanics"],["KW0092","department","D10","manufacturing"],["KW0093","department","D10","cad cam"],
        # Rooms
        ["KW0094","room","R010","library"],["KW0095","room","R010","books"],["KW0096","room","R010","reading"],["KW0097","room","R019","computer lab"],["KW0098","room","R019","programming lab"],["KW0099","room","R021","seminar hall"],["KW0100","room","R021","orientation"],["KW0101","room","R040","ai lab"],["KW0102","room","R040","machine learning lab"],["KW0103","room","R038","conference hall"],["KW0104","room","R038","js block a"],
        # Facilities
        ["KW0105","facility","FAC01","library"],["KW0106","facility","FAC01","books"],["KW0107","facility","FAC01","journals"],["KW0108","facility","FAC02","food"],["KW0109","facility","FAC02","lunch"],["KW0110","facility","FAC02","breakfast"],["KW0111","facility","FAC03","health"],["KW0112","facility","FAC03","first aid"],["KW0113","facility","FAC04","parking"],["KW0114","facility","FAC04","bike"],["KW0115","facility","FAC07","wifi"],["KW0116","facility","FAC07","internet"],["KW0117","facility","FAC08","stationery"],["KW0118","facility","FAC08","books shop"],["KW0119","facility","FAC09","sports"],["KW0120","facility","FAC09","cricket"],["KW0121","facility","FAC10","xerox"],["KW0122","facility","FAC10","printing"],["KW0123","facility","FAC10","photocopy"],
        # Services/Offices
        ["KW0124","office","OFF01","principal"],["KW0125","office","OFF01","head of institution"],["KW0126","office","OFF02","admin"],["KW0127","office","OFF02","id card"],["KW0128","office","OFF02","bonafide"],["KW0129","office","OFF03","fees"],["KW0130","office","OFF03","payment"],["KW0131","office","OFF04","exam"],["KW0132","office","OFF04","hall ticket"],["KW0133","office","OFF04","results"],["KW0134","office","OFF04","transcript"],["KW0135","office","OFF05","placement"],["KW0136","office","OFF05","job"],["KW0137","office","OFF05","recruitment"],["KW0138","office","OFF07","library membership"],["KW0139","office","OFF07","book lending"],["KW0140","office","OFF08","bus pass"],["KW0141","office","OFF08","transport"],["KW0142","office","OFF11","wifi help"],["KW0143","office","OFF11","email setup"],["KW0144","office","OFF11","lms"],["KW0145","office","OFF11","student portal"],
        # Clubs
        ["KW0146","club","C001","AI"],["KW0147","club","C001","machine learning"],["KW0148","club","C001","deep learning"],["KW0149","club","C002","coding"],["KW0150","club","C002","competitive programming"],["KW0151","club","C002","leetcode"],["KW0152","club","C003","electronics"],["KW0153","club","C003","arduino"],["KW0154","club","C003","circuits"],["KW0155","club","C004","robotics"],["KW0156","club","C004","robot building"],["KW0157","club","C005","startup"],["KW0158","club","C005","entrepreneurship"],["KW0159","club","C006","cybersecurity"],["KW0160","club","C006","ethical hacking"],["KW0161","club","C006","ctf"],["KW0162","club","C007","design"],["KW0163","club","C007","figma"],["KW0164","club","C007","ui ux"],["KW0165","club","C008","data science"],["KW0166","club","C008","kaggle"],["KW0167","club","C009","environment"],["KW0168","club","C009","green"],["KW0169","club","C010","debate"],["KW0170","club","C010","public speaking"],["KW0171","club","C011","automobile"],["KW0172","club","C011","go-kart"],["KW0173","club","C012","drone"],["KW0174","club","C012","uav"],
        # IT Onboarding
        ["KW0175","it_onboarding","ITO01","wifi password"],["KW0176","it_onboarding","ITO01","internet access"],["KW0177","it_onboarding","ITO01","campus network"],["KW0178","it_onboarding","ITO02","email setup"],["KW0179","it_onboarding","ITO02","college email"],["KW0180","it_onboarding","ITO03","lms login"],["KW0181","it_onboarding","ITO03","course materials"],["KW0182","it_onboarding","ITO03","assignments"],["KW0183","it_onboarding","ITO04","student portal login"],["KW0184","it_onboarding","ITO04","attendance"],["KW0185","it_onboarding","ITO04","internal marks"],
        # Student Support
        ["KW0186","student_support","SUP01","complaint"],["KW0187","student_support","SUP01","grievance"],["KW0188","student_support","SUP02","ragging"],["KW0189","student_support","SUP02","anti ragging"],["KW0190","student_support","SUP02","helpline"],["KW0191","student_support","SUP03","counseling"],["KW0192","student_support","SUP03","mental health"],["KW0193","student_support","SUP03","stress"],["KW0194","student_support","SUP04","first aid"],["KW0195","student_support","SUP04","nurse"],["KW0196","student_support","SUP05","security"],["KW0197","student_support","SUP05","emergency"],["KW0198","student_support","SUP06","women safety"],["KW0199","student_support","SUP06","harassment"],
    ]
    write_csv("reference", "entity_keywords.csv",
        ["keyword_id","entity_type","entity_id","keyword"],
        rows)

def gen_faq():
    rows = [
        ["FAQ01","Where is the Principal Office?","The Principal Office is located on the Ground Floor of RV Block (the main building). You can reach it by entering from the main entrance and turning right. The Principal, Dr. V. Ramachandran, is available Mon–Fri from 09:00 AM to 05:00 PM.","building","office","OFF01"],
        ["FAQ02","Where is the Administrative Office?","The Administrative Office is on the Ground Floor of RV Block, adjacent to the Principal Office. It handles student ID cards, bonafide certificates, and general records. Open Mon–Fri 09:00 AM to 05:00 PM.","building","office","OFF02"],
        ["FAQ03","Where is the Exam Cell?","The Exam Cell is on the First Floor of RV Block. It handles examination schedules, hall ticket distribution, arrear management, and transcript requests. Contact: examcell@sce.edu, +91-9876540204.","building","office","OFF04"],
        ["FAQ04","How do I get a Bonafide Certificate?","Visit the Administrative Office on the Ground Floor of RV Block with your Student ID and a letter stating the purpose (e.g., bank loan, scholarship). You can also apply online at forms.sce.edu/bonafide. The certificate is ready in 2 working days.","registration","office","OFF02"],
        ["FAQ05","How do I get a bus pass?","Apply at the Transport Office on the Ground Floor of RV Block. Select your bus route, pay the monthly fare at the Accounts Office, and submit the form with your student ID and address proof. Pass is issued within 3 working days.","registration","office","OFF08"],
        ["FAQ06","What is the fee for a bus pass?","Bus pass fees vary by route. Routes range from Rs. 300 to Rs. 550 per month depending on the distance. Check the full route list and fees at the Transport Office or portal.sce.edu/transport.","fees","office","OFF08"],
        ["FAQ07","Where is the canteen?","The Central Canteen is in the Canteen Block, adjacent to RV Block. It is open Monday to Saturday from 08:00 AM to 04:30 PM. It serves breakfast (08:00–10:00 AM), lunch (12:00–02:30 PM), and snacks (03:30–04:30 PM). Tea and coffee are available all day.","campus","facility","FAC02"],
        ["FAQ08","What are the library timings?","The Central Library on the First Floor of RV Block is open Monday to Saturday from 08:30 AM to 05:30 PM. Closed on Sundays and national holidays. Borrow up to 3 books for 14 days. Renew online at library.sce.edu.","campus","facility","FAC01"],
        ["FAQ09","How do I connect to campus WiFi?","Select 'SCE_CAMPUS' on your device. Login with your register number and default password (DDMMYYYY + last 2 digits of register number). For issues, contact the IT Support Desk on the second floor of RV Block or call +91-9876540210.","it","it_onboarding","ITO01"],
        ["FAQ10","How do I access the LMS?","Go to lms.sce.edu and log in with your register number and date of birth (DDMMYYYY). Your courses are automatically enrolled. Contact IT Support Desk if you cannot access your courses.","it","it_onboarding","ITO03"],
        ["FAQ11","What is my college email ID?","Your college email is firstname.registernumber@student.sce.edu. Default password is your register number. Log in at mail.sce.edu and change your password on first login.","it","it_onboarding","ITO02"],
        ["FAQ12","Where are AIML classes held?","The AIML department is located in BD Block (also known as JS-CH Block). Third-year AIML students primarily use rooms BD-2-301 and BD-2-302 on the third floor. The AI Lab is on the third floor (Room R040).","academic","department","D02"],
        ["FAQ13","Where are ECE classes held?","The ECE department is in KS Block (east of RV Block). Classes are held in rooms KS-301 to KS-303. The Electronics Lab is on the second floor of KS Block.","academic","department","D06"],
        ["FAQ14","Which block is the CSE department in?","The CSE department is in RV Block, the main building. First-year CSE students attend classes in RV-301 to RV-305 on the third floor. Computer Labs are on the second floor.","academic","department","D01"],
        ["FAQ15","What does ICE stand for?","ICE stands for Instrumentation and Control Engineering. It is housed in KS Block along with ECE, EEE, and IT departments. The ICE department covers process control, PLCs, sensors, and industrial automation.","academic","department","D08"],
        ["FAQ16","What does JS-CH mean?","JS-CH is an alternate name for BD Block. BD Block is also referred to as the JS-CH Block. It houses the AIML, AIDS, CSBS, and Civil Engineering departments.","building","building","B03"],
        ["FAQ17","How do I join a club?","Visit the club's open house session in the first two weeks of semester (announced via the college portal and notice boards). Fill the club registration form and get it signed by the faculty coordinator. Most clubs have no registration fee.","registration","office","OFF09"],
        ["FAQ18","Is there a hostel on campus?","Yes. The campus has separate hostels for male and female students located in the Hostel Complex on the north side of campus. Contact: ganga.warden@sce.edu (Men's), kaveri.warden@sce.edu (Women's). Apply online at forms.sce.edu/hostel before the semester starts.","campus","building","B09"],
        ["FAQ19","How do I pay my semester fees?","Pay online at fees.sce.edu using UPI, net banking, or debit card. For offline payment, visit the Accounts Office on the Ground Floor of RV Block. Payment deadline for first-year students is 31 July 2026.","fees","office","OFF03"],
        ["FAQ20","How do I get my hall ticket?","Hall tickets are issued by the Exam Cell one week before semester-end exams. Collect from the Exam Cell (First Floor, RV Block) with your student ID. Students with fee dues or insufficient attendance may not receive hall tickets.","exam","office","OFF04"],
        ["FAQ21","Where is the Mechanical department?","The Mechanical Engineering (MECH) department is in ME Block, located at the far end of campus. The ME Workshop for hands-on practice is adjacent to ME Block. Labs include CAD/CAM Lab and Thermodynamics Lab.","academic","department","D10"],
        ["FAQ22","How do I apply for an OD?","Fill the OD request form (available at forms.sce.edu/od or from your department HOD office). Attach the event invitation or proof of participation. Submit to your HOD at least 2 days before the event. Collect the approved OD letter before the event.","registration","office","OFF09"],
        ["FAQ23","Is there a medical room on campus?","Yes. The Medical Room is on the Ground Floor of RV Block. A campus nurse is available Monday to Friday, 09:00 AM to 04:00 PM. For emergencies, call +91-9876540209 or contact campus security at +91-9876540100.","campus","facility","FAC03"],
        ["FAQ24","Where can I park my bike or vehicle?","The Parking Area is near the Main Gate. Students require a parking permit issued by the Transport Office. Two-wheeler and four-wheeler parking zones are clearly marked. The area is open 24x7.","campus","facility","FAC04"],
        ["FAQ25","How do I report ragging?","Report any act of ragging immediately to the Anti-Ragging Committee. Call the national helpline: 1800-180-5522 (toll-free, 24x7). You can also approach the Principal Office or submit a complaint at antiragging.in. All complaints are strictly confidential.","support","student_support","SUP02"],
        ["FAQ26","Is there counseling available?","Yes. The Student Counseling Centre offers free counseling for academic stress, career uncertainty, and personal challenges. Contact Ms. A. Preethi (Counselor) at counseling@sce.edu or +91-9876540250. Available Mon–Fri 09:00 AM to 05:00 PM. Appointments via the student portal.","support","student_support","SUP03"],
        ["FAQ27","Where can I photocopy or print documents?","The Reprography/Xerox shop is on the Ground Floor of RV Block, near the library. Open Monday to Saturday, 09:00 AM to 06:00 PM. Services include photocopying, printing, and spiral binding.","campus","facility","FAC10"],
        ["FAQ28","How do I get from the main gate to BD Block?","From the Main Gate, walk straight along the main road to RV Block (2 minutes). From RV Block, take the central pathway east. BD Block is visible ahead and reachable in approximately 3 minutes (total ~5 minutes from the gate).","navigation","building","B03"],
        ["FAQ29","What clubs are available?","The college has 12 active clubs including Neural Nexus (AI/ML), CodeForge (Programming), CircuitSphere (Electronics), RoboWorks (Robotics), Data Mavericks (Data Science), Cyber Sentinels (Cybersecurity), Pixel Studio (Design), SpeakUp Forum (Debate), and more. Register during the first two weeks of semester.","club","",""],
        ["FAQ30","What is the WiFi password?","Campus WiFi password defaults to your date of birth (DDMMYYYY) followed by the last 2 digits of your register number. Connect to 'SCE_CAMPUS' and enter this at the login page. Change your password after first login. For help, contact IT Support at +91-9876540210.","it","it_onboarding","ITO01"],
        ["FAQ31","What are the placement companies visiting this year?","Companies scheduled for the 2026–27 placement season include Infosys (5 Oct), TCS (15 Oct), Wipro (22 Oct), HCL Technologies (2 Nov), and Cognizant (12 Nov). Final-year students from eligible departments should register at the Placement Cell with their updated resume.","placement","office","OFF05"],
        ["FAQ32","What is the minimum CGPA for placement?","Most companies visiting campus require a minimum CGPA of 6.0. Some companies like Wipro require 6.5 CGPA. Check the specific eligibility criteria for each company on the Placement Cell notice board or portal.sce.edu/placements.","placement","office","OFF05"],
        ["FAQ33","What is the total semester fee for CSE?","The total annual fee for CSE is approximately Rs. 1,02,000 (tuition Rs. 90,000 + lab Rs. 5,000 + library Rs. 2,000 + exam Rs. 3,000 + misc Rs. 2,000). Fees for second year onwards include higher lab fees. Check the exact breakdown at fees.sce.edu.","fees","department","D01"],
        ["FAQ34","Where do I submit a leave application?","Submit your leave application to your class advisor. The form is available at forms.sce.edu/leave or from the department office. For leave exceeding 3 days, attach a parent/guardian letter. The advisor will update your attendance record.","registration","office","OFF09"],
        ["FAQ35","What bus routes are available?","The college operates 10 bus routes covering Tambaram, Chromepet, Velachery, Porur, Avadi, Perambur, Sholinganallur, Guindy, Maduravoyal, and Sriperumbudur. All buses arrive at the Main Gate by 08:00 AM and depart at 05:30 PM. Apply for a bus pass at the Transport Office.","transport","office","OFF08"],
    ]
    write_csv("reference", "faq.csv",
        ["faq_id","question","answer","category","related_entity_type","related_entity_id"],
        rows)

# ---------------------------------------------------------------------------
# JUNCTION
# ---------------------------------------------------------------------------

def gen_faculty_subjects():
    rows = [
        # F001 Karthik Menon — CSE HOD
        ["F001","SUB004","2026-2027",3],["F001","SUB005","2026-2027",3],
        # F002 Suresh Babu
        ["F002","SUB001","2026-2027",1],["F002","SUB008","2026-2027",7],
        # F003 Vikram Shah
        ["F003","SUB002","2026-2027",1],["F003","SUB007","2026-2027",5],
        # F004 Anita Rao
        ["F004","SUB003","2026-2027",1],["F004","SUB006","2026-2027",5],
        # F005 Arvind Raman — AIML HOD
        ["F005","SUB010","2026-2027",1],["F005","SUB011","2026-2027",3],["F005","SUB013","2026-2027",5],
        # F006 Aishwarya Rao
        ["F006","SUB011","2026-2027",3],["F006","SUB013","2026-2027",5],
        # F007 Deepa Srinivasan
        ["F007","SUB012","2026-2027",3],["F007","SUB014","2026-2027",5],
        # F008 Priya Nair — AIDS HOD
        ["F008","SUB016","2026-2027",1],["F008","SUB018","2026-2027",5],
        # F009 Rahul Dev
        ["F009","SUB017","2026-2027",3],
        # F010 Divya Srinivas — CSBS HOD
        ["F010","SUB019","2026-2027",1],["F010","SUB020","2026-2027",3],
        # F012 Naveen Kumar — Civil HOD
        ["F012","SUB021","2026-2027",1],["F012","SUB022","2026-2027",3],
        # F014 Meena Krishnan — ECE HOD
        ["F014","SUB023","2026-2027",1],["F014","SUB024","2026-2027",3],
        # F015 Sunil Thomas
        ["F015","SUB024","2026-2027",3],["F015","SUB025","2026-2027",5],
        # F016 Kavita Iyer
        ["F016","SUB025","2026-2027",5],
        # F017 Sanjay Iyer — EEE HOD
        ["F017","SUB026","2026-2027",1],["F017","SUB027","2026-2027",3],
        # F019 Rahul Verma — ICE HOD
        ["F019","SUB028","2026-2027",1],["F019","SUB029","2026-2027",3],
        # F021 Lakshmi Narayanan — IT HOD
        ["F021","SUB030","2026-2027",1],["F021","SUB031","2026-2027",3],
        # F022 Ajay Menon
        ["F022","SUB032","2026-2027",5],
        # F023 Hari Prasad — MECH HOD
        ["F023","SUB033","2026-2027",1],["F023","SUB034","2026-2027",3],
        # F025 Mohan Lal
        ["F025","SUB035","2026-2027",5],
        # F009 Rahul Dev additional
        ["F009","SUB015","2026-2027",7],
    ]
    write_csv("junction", "faculty_subjects.csv",
        ["faculty_id","subject_id","academic_year","semester"],
        rows)

def gen_room_equipment():
    rows = [
        # Classrooms get projector + whiteboard
        *[[f"R{i:03d}","EQ01",1] for i in range(11,21)],
        *[[f"R{i:03d}","EQ13",1] for i in range(11,21)],
        ["R021","EQ01",2],["R021","EQ02",1],["R021","EQ03",4],["R021","EQ14",1],
        # Labs
        ["R019","EQ04",40],["R019","EQ01",1],
        ["R020","EQ04",40],["R020","EQ01",1],
        ["R030","EQ05",10],["R030","EQ06",5],["R030","EQ07",15],["R030","EQ08",8],
        ["R031","EQ07",10],
        ["R040","EQ04",30],["R040","EQ01",1],["R040","EQ03",2],
        ["R041","EQ04",40],["R041","EQ01",1],
        ["R047","EQ04",30],["R047","EQ01",1],
        ["R046","EQ09",2],
        ["R048","EQ11",3],["R048","EQ10",2],["R048","EQ12",2],
        ["R049","EQ14",2],["R049","EQ01",2],
    ]
    write_csv("junction", "room_equipment.csv",
        ["room_id","equipment_id","quantity"],
        rows)

def gen_club_membership(student_ids, club_ids):
    random.seed(99)
    rows = []
    seen = set()
    student_list = sorted(student_ids)[:50]
    club_list = sorted(club_ids)
    roles = ["member","member","member","member","secretary","treasurer"]
    for club in club_list:
        members = random.sample(student_list, min(8, len(student_list)))
        for i, stu in enumerate(members):
            key = (club, stu)
            if key not in seen:
                seen.add(key)
                role = "president" if i == 0 else random.choice(roles)
                rows.append([club, stu, role, "2026-07-20"])
    write_csv("junction", "club_membership.csv",
        ["club_id","student_id","role","joined_date"],
        rows)

# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------

def main():
    print("\n=== SCE Student Portal Dataset Generator ===\n")

    # Phase A — Tier 1
    print("--- Phase A: Foundation ---")
    building_ids = gen_buildings()
    dept_ids = gen_departments()
    equip_ids = gen_equipment()
    gen_academic_calendar()
    route_ids = gen_transport()

    # Phase B — Tier 2
    print("--- Phase B: Rooms, Offices, Facilities ---")
    all_room_ids, room_map, room_rows = gen_rooms()
    office_ids = gen_offices(room_rows)
    gen_facilities()
    gen_navigation()
    hostel_ids = gen_hostels()
    gen_transport_stops(route_ids)

    # Phase C — Tier 3
    print("--- Phase C: Faculty, Subjects, Contacts, Services ---")
    faculty_ids = gen_faculty(room_rows)
    subject_map = gen_subjects()
    gen_contacts()
    process_ids = gen_registration_process()
    gen_campus_services()
    gen_library_books(dept_ids)
    gen_fees()
    gen_student_support()

    # Phase D — Tier 4
    print("--- Phase D: Students, Academic, Forms ---")
    student_ids = gen_students(faculty_ids, dept_ids, hostel_ids, route_ids, all_room_ids)
    gen_timetable(room_rows, faculty_ids, subject_map)
    gen_exam_schedule(dept_ids, subject_map, all_room_ids)
    gen_forms()
    gen_registration_steps()
    gen_faculty_subjects()
    gen_room_equipment()
    it_ids = gen_it_onboarding()
    gen_it_onboarding_steps(it_ids)
    gen_placement()

    # Phase E — Tier 5
    print("--- Phase E: Clubs, Events, Announcements ---")
    club_ids = gen_clubs()
    event_ids = gen_events()
    gen_placement_eligibility()
    gen_club_membership(student_ids, club_ids)
    gen_canteen()

    # Phase F — Reference/Semantic
    print("--- Phase F: Reference & Semantic Layer ---")
    gen_id_mapping()
    gen_aliases()
    gen_keywords()
    gen_faq()
    gen_announcements(event_ids)

    print("\n=== All CSV files generated successfully! ===")
    print(f"Output directory: {BASE}")

if __name__ == "__main__":
    main()
