# Dataset Verification Proof

## 1. Directory Tree & Total Files

```text
- Dataset_for_chatbot/
    - announcements.csv
    - buildings.csv
    - campus_services.csv
    - clubs.csv
    - contacts.csv
    - departments.csv
    - events.csv
    - facilities.csv
    - faculty.csv
    - faq.csv
    - navigation.csv
    - offices.csv
    - registration_process.csv
    - rooms.csv
    - timetable.csv
    - academic/
        - academic_calendar.csv
        - exam_schedule.csv
        - fees_structure.csv
        - timetable.csv
    - activities/
        - clubs.csv
        - events.csv
        - placement_drives.csv
    - campus/
        - canteen_menu.csv
        - facilities.csv
        - hostel.csv
        - library_books.csv
        - navigation.csv
        - transport_routes.csv
    - core/
        - buildings.csv
        - departments.csv
        - faculty.csv
        - offices.csv
        - rooms.csv
        - student_profiles.csv
        - subject_master.csv
    - junction/
        - club_membership.csv
        - faculty_subjects.csv
        - it_onboarding_steps.csv
        - placement_drive_eligibility.csv
        - registration_steps.csv
        - room_equipment.csv
        - transport_stops.csv
    - reference/
        - aliases.csv
        - entity_keywords.csv
        - equipment.csv
        - faq.csv
        - id_mapping.csv
    - services/
        - announcements.csv
        - campus_services.csv
        - contacts.csv
        - forms.csv
        - it_onboarding.csv
        - registration_process.csv
        - student_support.csv
```

**Total CSV files generated:** 54

**All 39 expected CSVs exist:** No

## 6. Output of verify_dataset.py

```text
=== SCE Student Portal Dataset Verification ===

--- 1. File Presence & Volume Check ---
[OK] core/buildings.csv (9 rows)
[OK] core/departments.csv (10 rows)
[OK] core/rooms.csv (50 rows)
[OK] core/faculty.csv (25 rows)
[OK] core/subject_master.csv (35 rows)
[OK] core/offices.csv (11 rows)
[OK] core/student_profiles.csv (75 rows)
[OK] academic/academic_calendar.csv (19 rows)
[OK] academic/fees_structure.csv (40 rows)
[OK] academic/exam_schedule.csv (28 rows)
[OK] academic/timetable.csv (90 rows)
[OK] campus/facilities.csv (10 rows)
[OK] campus/navigation.csv (21 rows)
[OK] campus/hostel.csv (5 rows)
[OK] campus/transport_routes.csv (10 rows)
[OK] campus/canteen_menu.csv (30 rows)
[OK] campus/library_books.csv (35 rows)
[OK] activities/clubs.csv (12 rows)
[OK] activities/events.csv (15 rows)
[OK] activities/placement_drives.csv (5 rows)
[OK] services/registration_process.csv (10 rows)
[OK] services/campus_services.csv (10 rows)
[OK] services/contacts.csv (12 rows)
[OK] services/forms.csv (8 rows)
[OK] services/student_support.csv (6 rows)
[OK] services/it_onboarding.csv (5 rows)
[OK] services/announcements.csv (15 rows)
[OK] reference/equipment.csv (15 rows)
[OK] reference/id_mapping.csv (11 rows)
[OK] reference/aliases.csv (90 rows)
[OK] reference/entity_keywords.csv (199 rows)
[OK] reference/faq.csv (35 rows)
[OK] junction/transport_stops.csv (54 rows)
[OK] junction/registration_steps.csv (47 rows)
[OK] junction/it_onboarding_steps.csv (26 rows)
[OK] junction/faculty_subjects.csv (38 rows)
[OK] junction/room_equipment.csv (46 rows)
[OK] junction/club_membership.csv (96 rows)
[OK] junction/placement_drive_eligibility.csv (24 rows)

--- 2. Primary Key Uniqueness ---
[OK] Primary keys validated.

--- 3. Foreign Key Integrity ---
[OK] All foreign keys validated successfully.

=== Verification Complete ===
Verdict: DATASET IS VALID AND READY FOR DEMO.

```

**7. Foreign Key Errors:** 0

**8. Duplicate Primary Keys:** 0

**9. Warnings Encountered:** 0

## 3 & 4. Row Counts and Sample Data (First 5 rows)

### academic/academic_calendar.csv (19 rows)

```csv
calendar_id,event_type,title,start_date,end_date,applies_to,description
CAL01,semester_start,Odd Semester 2026–27 Begins,2026-07-15,2026-07-15,all,The academic odd semester for 2026–27 begins on 15...
CAL02,orientation,First Year Orientation Program,2026-07-16,2026-07-17,I,Orientation for first-year students is conducted o...
CAL03,deadline,Last Date for Fee Payment — Semester 1,2026-07-31,2026-07-31,I,Final date to pay semester fees without late penal...
CAL04,deadline,Last Date for Fee Payment — Sem 3/5/7,2026-08-05,2026-08-05,all,Fee payment deadline for second, third, and fourth...
CAL05,deadline,Club Registration Deadline,2026-08-10,2026-08-10,all,Last date for students to register for college clu...
```

### academic/exam_schedule.csv (28 rows)

```csv
exam_id,department_id,year,semester,subject_id,exam_date,exam_time,duration_minutes,hall_room_id,exam_type,last_updated
EXM001,D01,I,1,SUB001,2026-08-25,09:30,180,R013,internal_1,2026-07-17
EXM002,D01,I,1,SUB002,2026-08-26,09:30,180,R034,internal_1,2026-07-17
EXM003,D01,I,1,SUB003,2026-08-27,09:30,180,R014,internal_1,2026-07-17
EXM004,D01,II,3,SUB004,2026-08-28,09:30,180,R023,internal_1,2026-07-17
EXM005,D02,I,1,SUB010,2026-08-25,09:30,180,R022,internal_1,2026-07-17
```

### academic/fees_structure.csv (40 rows)

```csv
fee_id,department_id,year,academic_year,tuition_fee,lab_fee,library_fee,exam_fee,misc_fee,total_fee,due_date,late_penalty_per_day
FEE01,D01,I,2026-2027,90000,3000,2000,3000,2000,100000,2026-07-31,100
FEE02,D01,II,2026-2027,90000,5000,2000,3000,2000,102000,2026-07-31,100
FEE03,D01,III,2026-2027,90000,5000,2000,3000,2000,102000,2026-07-31,100
FEE04,D01,IV,2026-2027,90000,5000,2000,3000,2000,102000,2026-07-31,100
FEE05,D02,I,2026-2027,95000,3000,2000,3000,2000,105000,2026-07-31,100
```

### academic/timetable.csv (90 rows)

```csv
timetable_id,department_id,year,section,semester,academic_year,day,period,time,subject_id,room_id,faculty_id,lab_or_theory,effective_from,effective_until
TT0001,D02,III,A,5,2026-2027,Monday,P1,09:00-09:50,SUB013,R037,F005,theory,2026-07-15,2026-11-22
TT0002,D02,III,A,5,2026-2027,Monday,P2,09:50-10:40,SUB011,R037,F006,theory,2026-07-15,2026-11-22
TT0003,D02,III,A,5,2026-2027,Monday,P3,10:55-11:45,SUB014,R037,F007,theory,2026-07-15,2026-11-22
TT0004,D02,III,A,5,2026-2027,Monday,P4,11:45-12:35,SUB012,R040,F005,lab,2026-07-15,2026-11-22
TT0005,D02,III,A,5,2026-2027,Monday,P5,01:20-02:10,SUB013,R037,F006,theory,2026-07-15,2026-11-22
```

### activities/clubs.csv (12 rows)

```csv
club_id,club_name,category,focus_area,meeting_building_id,meeting_room_id,meeting_frequency,meeting_day,meeting_time,coordinator_faculty_id,lead_student_id,contact_email,registration_process_id,description
C001,Neural Nexus,technical,Artificial Intelligence and Machine Learning,B03,R040,weekly,Saturday,15:00-17:00,F005,STU0001,neuralnexus@sce.edu,PROC05,Neural Nexus is the AI and Machine Learning club o...
C002,CodeForge,technical,Competitive Programming and Software Development,B01,R019,weekly,Friday,15:00-17:00,F003,STU0002,codeforge@sce.edu,PROC05,CodeForge is the competitive programming and devel...
C003,CircuitSphere,technical,Electronics and Embedded Systems,B02,R030,biweekly,Saturday,14:00-16:00,F014,STU0003,circuitsphere@sce.edu,PROC05,CircuitSphere is the electronics and embedded syst...
C004,RoboWorks,technical,Robotics and Automation,B05,R048,weekly,Saturday,10:00-13:00,F023,STU0004,roboworks@sce.edu,PROC05,RoboWorks is the robotics club that designs and bu...
C005,Innovators Guild,innovation,Startup and Entrepreneurship,B03,R038,monthly,Last Saturday,14:00-17:00,F010,STU0005,innovators@sce.edu,PROC05,The Innovators Guild is the college entrepreneursh...
```

### activities/events.csv (15 rows)

```csv
event_id,title,description,event_type,venue_room_id,venue_building_id,start_date,end_date,start_time,end_time,registration_deadline,organizer_department_id,organizer_club_id,eligibility,fee,status,last_updated
EVT001,Freshers Orientation 2026,Welcome orientation for all first-year students of...,orientation,R021,B01,2026-07-16,2026-07-17,09:00,17:00,2026-07-14,D01,,all,0,completed,2026-07-01
EVT002,AI Hackathon 2026,24-hour inter-college AI hackathon organized by th...,hackathon,R038,B03,2026-08-20,2026-08-21,09:00,09:00,2026-08-10,D02,,all,200,upcoming,2026-07-10
EVT003,Project Expo 2026,Annual student project exhibition where teams from...,competition,R048,B05,2026-09-12,2026-09-12,09:00,17:00,2026-09-05,D01,,all,0,upcoming,2026-07-10
EVT004,Core Tech Symposium,Inter-college technical symposium organized by ECE...,symposium,R038,B03,2026-09-20,2026-09-20,09:00,17:00,2026-09-12,D06,,all,100,upcoming,2026-07-10
EVT005,Circuit Workshop,Hands-on Arduino and embedded systems workshop for...,workshop,R030,B02,2026-08-14,2026-08-14,09:00,17:00,2026-08-08,D06,C003,500,nonveg,100,upcoming,2026-07-10
```

### activities/placement_drives.csv (5 rows)

```csv
drive_id,company_name,drive_date,min_cgpa,package_lpa_min,package_lpa_max,registration_deadline,process_description,tpo_contact_id,status,last_updated
PLC01,Infosys,2026-10-05,6.0,3.6,4.5,2026-09-25,Infosys recruitment process includes an online apt...,CON04,upcoming,2026-07-12
PLC02,TCS,2026-10-15,6.0,3.36,5.0,2026-10-05,TCS recruitment consists of TCS NQT (National Qual...,CON04,upcoming,2026-07-12
PLC03,Wipro,2026-10-22,6.5,3.5,4.0,2026-10-12,Wipro recruitment includes an aptitude test (NLTH ...,CON04,upcoming,2026-07-12
PLC04,HCL Technologies,2026-11-02,6.0,3.25,4.5,2026-10-25,HCL recruitment includes online aptitude, technica...,CON04,upcoming,2026-07-12
PLC05,Cognizant,2026-11-12,6.0,4.0,5.5,2026-11-01,Cognizant GenC programme includes aptitude, coding...,CON04,upcoming,2026-07-12
```

### announcements.csv (8 rows)

```csv
title,category,priority,description
Semester Begins,Academic,High,Welcome to the new semester.
Internal Assessment,Exam,High,Check department timetable.
Placement Drive,Placement,High,Eligible final year students.
AI Hackathon,Event,Medium,Registration open.
Project Expo,Event,Medium,Submit abstracts before deadline.
```

### buildings.csv (5 rows)

```csv
building_id,building_name,alias,description
B01,RV Block,,Main administrative block. Principal office, admin...
B02,KS Block,,Core engineering block for ECE, EEE, ICE and IT (2...
B03,BD Block,JS-CH,AIML, AIDS, CIVIL and CSBS (2nd-4th year).
B04,ME Block,,Mechanical Engineering academic block.
B05,ME Workshop,,Workshop building. Symposiums are commonly conduct...
```

### campus/canteen_menu.csv (30 rows)

```csv
menu_id,day,meal_type,item_name,price,veg_nonveg,available_from,available_to
MNU001,Monday,breakfast,Idli Sambar,20,veg,08:00,10:00
MNU002,Monday,breakfast,Masala Dosa,30,veg,08:00,10:00
MNU003,Monday,lunch,Rice + Sambar + Poriyal,50,veg,12:00,14:30
MNU004,Monday,lunch,Chicken Biryani,80,nonveg,12:00,14:30
MNU005,Monday,snacks,Vada + Tea,25,veg,15:30,16:30
```

### campus/facilities.csv (10 rows)

```csv
facility_id,facility_name,category,building_id,room_id,timing,description
FAC01,Central Library,academic,B01,R010,Mon-Sat 08:30-17:30,The Central Library on the first floor of RV Block...
FAC02,Central Canteen,food,B08,,Mon-Sat 08:00-16:30,The Central Canteen in the Canteen Block serves ho...
FAC03,Medical Room,health,B01,R006,Mon-Fri 09:00-16:00,The Medical Room on the ground floor of RV Block p...
FAC04,Parking Area,transport,B06,,24x7,The Parking Area near the Main Gate provides desig...
FAC05,RO Drinking Water,utility,B01,,24x7,RO-purified drinking water stations are available ...
```

### campus/hostel.csv (5 rows)

```csv
hostel_id,hostel_name,gender,warden_name,warden_phone,warden_email,room_type,fee_per_year,mess_included,total_rooms,capacity,nearest_building_id,rules_summary,description,last_updated
H01,Ganga Men's Hostel Block A,male,Mr. P. Murugan,9876540101,ganga.warden@sce.edu,double,36000,yes,40,80,B09,In-time 10:00 PM. No visitors after 6 PM. Mess foo...,Ganga Men's Hostel Block A is a double-occupancy h...,2026-07-01
H02,Ganga Men's Hostel Block B,male,Mr. P. Murugan,9876540101,ganga.warden@sce.edu,triple,28000,yes,40,120,B09,Same rules as Block A.,Ganga Men's Hostel Block B offers triple-occupancy...,2026-07-01
H03,Kaveri Women's Hostel Block A,female,Ms. R. Sumathi,9876540102,kaveri.warden@sce.edu,double,38000,yes,40,80,B09,In-time 9:00 PM. Female visitors only after 5 PM. ...,Kaveri Women's Hostel Block A is a double-occupanc...,2026-07-01
H04,Kaveri Women's Hostel Block B,female,Ms. R. Sumathi,9876540102,kaveri.warden@sce.edu,triple,30000,yes,40,120,B09,Same rules as Block A.,Kaveri Women's Hostel Block B offers triple-occupa...,2026-07-01
H05,Saraswathi Men's Hostel,male,Mr. K. Venkatesh,9876540103,saras.warden@sce.edu,single,48000,no,20,20,B09,In-time 10:30 PM. Self-catering hostel. No mess fa...,Saraswathi Men's Hostel provides single-occupancy ...,2026-07-01
```

### campus/library_books.csv (35 rows)

```csv
book_id,title,author,subject_area,department_id,copies_available,shelf_location,isbn,description
LIB0001,Introduction to Algorithms,Cormen, Leiserson, Rivest, Stein,Algorithms,D01,3,Shelf A1-Row 1,9780262033848,Comprehensive textbook on algorithms and data stru...
LIB0002,The C Programming Language,Kernighan and Ritchie,Programming,D01,4,Shelf A1-Row 2,9780131103627,Classic reference for C programming by the creator...
LIB0003,Clean Code,Robert C. Martin,Software Engineering,D01,2,Shelf A1-Row 3,9780132350884,Best practices for writing maintainable and readab...
LIB0004,Database System Concepts,Silberschatz, Korth, Sudarshan,Databases,D01,3,Shelf A2-Row 1,9780078022159,Standard textbook for database management systems.
LIB0005,Computer Networks,Andrew Tanenbaum,Networking,D01,2,Shelf A2-Row 2,9780132126953,Complete reference on computer networking protocol...
```

### campus/navigation.csv (21 rows)

```csv
edge_id,source_building_id,dest_building_id,distance_meters,estimated_minutes,accessible_route,landmark,directions
NAV001,B06,B01,80,2,yes,College Bus Drop Zone,From the Main Gate, walk straight along the main r...
NAV002,B06,B08,90,2,yes,Security Cabin,From the Main Gate, walk along the main road and t...
NAV003,B01,B02,150,3,yes,Central Pathway,From RV Block, take the central pathway heading ea...
NAV004,B01,B03,200,3,yes,Central Pathway Junction,From RV Block, walk along the central pathway past...
NAV005,B01,B08,50,1,yes,Near RV Block Entrance,From RV Block, exit through the main entrance and ...
```

### campus/transport_routes.csv (10 rows)

```csv
route_id,route_name,departure_time,arrival_time,return_time,fare,days_of_operation,vehicle_type,description
TR01,Route 1 — Tambaram to Campus,06:30,08:00,17:30,400,Mon-Sat,bus,Route 1 picks up students from Tambaram Railway St...
TR02,Route 2 — Chromepet to Campus,06:45,08:00,17:30,350,Mon-Sat,bus,Route 2 covers Chromepet, Pallavaram, and Meenamba...
TR03,Route 3 — Velachery to Campus,07:00,08:00,17:30,450,Mon-Sat,bus,Route 3 starts from Velachery MRTS station coverin...
TR04,Route 4 — Porur to Campus,06:45,08:00,17:30,420,Mon-Sat,bus,Route 4 covers Porur, Valasaravakkam, and Ramapura...
TR05,Route 5 — Avadi to Campus,06:15,08:00,17:30,500,Mon-Sat,bus,Route 5 originates from Avadi and covers Ambattur,...
```

### campus_services.csv (7 rows)

```csv
service,provider,location
ID Card Issue,Administrative Office,RV Block
Fee Payment,Accounts Office,RV Block
Certificate Collection,Exam Cell,RV Block
Placement Support,Placement Cell,RV Block
Library Services,Library,RV Block
```

### clubs.csv (12 rows)

```csv
club_id,club_name,category,focus_area,meeting_place,meeting_frequency,data_type
C001,Neural Nexus,Technical,AI & ML,BD Block,Weekly,DEMO
C002,CodeForge,Technical,Programming,RV Block,Weekly,DEMO
C003,CircuitSphere,Technical,Electronics,KS Block,Biweekly,DEMO
C004,RoboWorks,Technical,Robotics,ME Workshop,Weekly,DEMO
C005,Innovators Guild,Innovation,Startups,BD Block,Monthly,DEMO
```

### contacts.csv (5 rows)

```csv
department_or_office,email,phone
Administrative Office,admin@sce.edu,+91-9876543201
Exam Cell,examcell@sce.edu,+91-9876543202
Placement Cell,placement@sce.edu,+91-9876543203
Library,library@sce.edu,+91-9876543204
Transport Office,transport@sce.edu,+91-9876543205
```

### core/buildings.csv (9 rows)

```csv
building_id,building_name,location_type,floor_count,operating_hours,accessibility,landmark,description
B01,RV Block,academic_block,4,08:00-18:00,ramp_and_lift,Main Entrance Gate,RV Block is the main academic and administrative b...
B02,KS Block,academic_block,4,08:00-18:00,ramp,Near RV Block,KS Block is the core engineering block housing the...
B03,BD Block,academic_block,4,08:00-18:00,ramp,Central Pathway,BD Block, also known as JS-CH Block, houses the AI...
B04,ME Block,academic_block,4,08:00-18:00,stairs_only,Near ME Workshop,ME Block houses the Mechanical Engineering departm...
B05,ME Workshop,workshop,1,08:00-17:00,ramp,Behind ME Block,The ME Workshop is a large ground-level workshop b...
```

### core/departments.csv (10 rows)

```csv
department_id,department_code,department_name,building_id,hod_faculty_id,email,phone,description
D01,CSE,Computer Science and Engineering,B01,F001,cse@sce.edu,+91-9876540001,The CSE department offers undergraduate programs i...
D02,AIML,Artificial Intelligence and Machine Learning,B03,F005,aiml@sce.edu,+91-9876540002,The AIML department specializes in Artificial Inte...
D03,AIDS,Artificial Intelligence and Data Science,B03,F008,aids@sce.edu,+91-9876540003,The AIDS department focuses on Data Science, Big D...
D04,CSBS,Computer Science and Business Systems,B03,F010,csbs@sce.edu,+91-9876540004,The CSBS department combines computer science with...
D05,CIVIL,Civil Engineering,B03,F012,civil@sce.edu,+91-9876540005,The Civil Engineering department covers structural...
```

### core/faculty.csv (25 rows)

```csv
faculty_id,faculty_name,designation,department_id,building_id,cabin_room_id,email,phone,office_hours
F001,Dr. Karthik Menon,Professor,D01,B01,R019,karthik.menon@sce.edu,+91-9876541001,Mon-Fri 10:00-12:00
F002,Dr. Suresh Babu,Associate Professor,D01,B01,R019,suresh.babu@sce.edu,+91-9876541002,Mon-Fri 11:00-13:00
F003,Prof. Vikram Shah,Assistant Professor,D01,B01,R020,vikram.shah@sce.edu,+91-9876541003,Mon-Fri 14:00-16:00
F004,Prof. Anita Rao,Assistant Professor,D01,B01,R020,anita.rao@sce.edu,+91-9876541004,Tue-Thu 10:00-12:00
F005,Dr. Arvind Raman,Professor,D02,B03,R039,arvind.raman@sce.edu,+91-9876541005,Mon-Fri 09:00-11:00
```

### core/offices.csv (11 rows)

```csv
office_id,office_name,building_id,room_id,floor,officer_in_charge,office_hours,description
OFF01,Principal Office,B01,R001,0,Dr. V. Ramachandran,Mon-Fri 09:00-17:00,The Principal Office is on the ground floor of RV ...
OFF02,Administrative Office,B01,R002,0,Mr. S. Krishnamurthy,Mon-Fri 09:00-17:00,The Administrative Office handles student records,...
OFF03,Accounts Office,B01,R003,0,Mr. T. Balakrishnan,Mon-Fri 09:00-17:00,The Accounts Office handles all fee payments, fee ...
OFF04,Exam Cell,B01,R008,1,Dr. P. Sundaram,Mon-Fri 09:00-17:00,The Exam Cell coordinates all examination activiti...
OFF05,Placement Cell,B01,R009,1,Ms. R. Kavitha,Mon-Fri 09:00-17:00,The Placement Cell coordinates campus placement dr...
```

### core/rooms.csv (50 rows)

```csv
room_id,building_id,room_number,floor,capacity,room_type,department_id,description
R001,B01,RV-GF-Principal,0,5,office,D01,Principal's Office located on the ground floor of ...
R002,B01,RV-GF-Admin,0,10,office,D01,Administrative Office on the ground floor of RV Bl...
R003,B01,RV-GF-Accounts,0,8,office,D01,Accounts Office on the ground floor of RV Block. H...
R004,B01,RV-GF-Admission,0,6,office,D01,Admission Cell on the ground floor of RV Block. Ha...
R005,B01,RV-GF-Transport,0,4,office,D01,Transport Office on the ground floor of RV Block. ...
```

### core/student_profiles.csv (75 rows)

```csv
student_id,register_number,name,department_id,year,section,advisor_faculty_id,current_room_id,hostel_id,transport_route_id
STU0001,22261100001,Shobha Iyer,D10,I,A,F023,R044,H05,
STU0002,22261100002,Rohit Kumar,D10,I,B,F023,R044,H01,
STU0003,22251010003,Nikhil Venkatesh,D01,II,B,F003,R011,,TR04
STU0004,22241060004,Sneha Balaji,D06,III,B,F015,R022,H05,
STU0005,22241050005,Rohit Venkatesh,D05,III,B,F012,R039,H03,
```

### core/subject_master.csv (35 rows)

```csv
subject_id,subject_code,subject_name,department_id,credits,subject_type,semester,year,description
SUB001,CS101,Engineering Mathematics I,D01,4,theory,1,I,Fundamental mathematics for engineers covering mat...
SUB002,CS102,Programming in C,D01,4,theory,1,I,Introduction to C programming: syntax, data types,...
SUB003,CS102L,Programming Lab,D01,2,lab,1,I,Practical C programming laboratory sessions.
SUB004,CS201,Data Structures,D01,4,theory,3,II,Stacks, queues, linked lists, trees, graphs, and s...
SUB005,CS202,Operating Systems,D01,4,theory,3,II,Process management, memory management, file system...
```

### departments.csv (10 rows)

```csv
department,building
CSE,RV Block
AIML,BD Block
AIDS,BD Block
CSBS,BD Block
CIVIL,BD Block
```

### events.csv (10 rows)

```csv
event_name,venue,description
Orientation,RV Block,First-year orientation
Placement Training,RV Block,Career guidance
General Conference,BD Block,College-wide conference
AI Hackathon,BD Block,Technical hackathon
Project Expo,BD Block,Student project exhibition
```

### facilities.csv (8 rows)

```csv
facility_name,category,location,timing
Library,Academic,RV Block,08:30-17:30
Central Canteen,Food,Near RV Block,08:00-16:30
Medical Room,Health,RV Block,09:00-16:00
Parking,Transport,Main Entrance,24x7
RO Drinking Water,Utility,All Blocks,24x7
```

### faculty.csv (12 rows)

```csv
faculty_id,faculty_name,department,designation,building,data_type
F001,Dr. Arvind Raman,AIML,Professor,BD Block,DEMO
F002,Dr. Priya Nair,AIDS,Associate Professor,BD Block,DEMO
F003,Dr. Karthik Menon,CSE,Professor,RV Block,DEMO
F004,Dr. Meena Krishnan,ECE,Professor,KS Block,DEMO
F005,Dr. Sanjay Iyer,EEE,Associate Professor,KS Block,DEMO
```

### faq.csv (7 rows)

```csv
question,answer
Where is the Principal Office?,RV Block
Where is the Administrative Office?,RV Block
Where are AIML classes?,BD Block
What is JS-CH?,JS-CH is another name for BD Block.
Where are ECE classes?,KS Block
```

### junction/club_membership.csv (96 rows)

```csv
club_id,student_id,role,joined_date
C001,STU0026,president,2026-07-20
C001,STU0025,member,2026-07-20
C001,STU0013,member,2026-07-20
C001,STU0039,treasurer,2026-07-20
C001,STU0012,member,2026-07-20
```

### junction/faculty_subjects.csv (38 rows)

```csv
faculty_id,subject_id,academic_year,semester
F001,SUB004,2026-2027,3
F001,SUB005,2026-2027,3
F002,SUB001,2026-2027,1
F002,SUB008,2026-2027,7
F003,SUB002,2026-2027,1
```

### junction/it_onboarding_steps.csv (26 rows)

```csv
onboarding_id,step_number,instruction
ITO01,1,Open WiFi settings on your device and select the n...
ITO01,2,Open a browser. You will be redirected to the SCE ...
ITO01,3,Enter your register number as username.
ITO01,4,Enter your default password (DDMMYYYY + last 2 dig...
ITO01,5,Click Login. You will be connected to campus WiFi.
```

### junction/placement_drive_eligibility.csv (24 rows)

```csv
drive_id,department_id
PLC01,D01
PLC01,D02
PLC01,D03
PLC01,D04
PLC01,D09
```

### junction/registration_steps.csv (47 rows)

```csv
process_id,step_number,instruction
PROC01,1,Visit the event page or department notice board to...
PROC01,2,Fill in your student details, team details (if tea...
PROC01,3,Submit the form to your faculty coordinator for ap...
PROC01,4,Pay the registration fee (if applicable) at the Ac...
PROC01,5,Collect your registration confirmation slip from t...
```

### junction/room_equipment.csv (46 rows)

```csv
room_id,equipment_id,quantity
R011,EQ01,1
R012,EQ01,1
R013,EQ01,1
R014,EQ01,1
R015,EQ01,1
```

### junction/transport_stops.csv (54 rows)

```csv
route_id,stop_number,stop_name,pickup_time
TR01,1,Tambaram Rly Station,06:30
TR01,2,Tambaram Bus Stand,06:35
TR01,3,Perungalathur,06:45
TR01,4,Guduvanchery,06:55
TR01,5,Singaperumal Koil,07:10
```

### navigation.csv (7 rows)

```csv
source,destination,walking_time,directions
Main Gate,RV Block,2 min,Walk straight from entrance.
RV Block,BD Block,3 min,Follow central pathway.
RV Block,KS Block,4 min,Walk east from RV Block.
RV Block,ME Block,6 min,Proceed towards Mechanical Block.
BD Block,ME Workshop,2 min,Workshop behind ME Block.
```

### offices.csv (8 rows)

```csv
office_name,block,location
Principal Office,RV Block,Ground Floor
Administrative Office,RV Block,Ground Floor
Accounts Office,RV Block,Ground Floor
Exam Cell,RV Block,First Floor
Placement Cell,RV Block,First Floor
```

### reference/aliases.csv (90 rows)

```csv
alias_id,entity_type,entity_id,alias_name,alias_type
ALI0001,building,B01,Main Block,casual
ALI0002,building,B01,Administration Block,casual
ALI0003,building,B01,Admin Block,abbreviation
ALI0004,building,B02,Engineering Block,casual
ALI0005,building,B02,KS,abbreviation
```

### reference/entity_keywords.csv (199 rows)

```csv
keyword_id,entity_type,entity_id,keyword
KW0001,building,B01,principal office
KW0002,building,B01,administrative office
KW0003,building,B01,admin
KW0004,building,B01,main building
KW0005,building,B01,first year
```

### reference/equipment.csv (15 rows)

```csv
equipment_id,equipment_name,category
EQ01,Projector,av_equipment
EQ02,Smart Board,av_equipment
EQ03,Air Conditioner,climate
EQ04,Desktop PC,computing
EQ05,Oscilloscope,lab_instrument
```

### reference/faq.csv (35 rows)

```csv
faq_id,question,answer,category,related_entity_type,related_entity_id
FAQ01,Where is the Principal Office?,The Principal Office is located on the Ground Floo...,building,office,OFF01
FAQ02,Where is the Administrative Office?,The Administrative Office is on the Ground Floor o...,building,office,OFF02
FAQ03,Where is the Exam Cell?,The Exam Cell is on the First Floor of RV Block. I...,building,office,OFF04
FAQ04,How do I get a Bonafide Certificate?,Visit the Administrative Office on the Ground Floo...,registration,office,OFF02
FAQ05,How do I get a bus pass?,Apply at the Transport Office on the Ground Floor ...,registration,office,OFF08
```

### reference/id_mapping.csv (11 rows)

```csv
mapping_id,building_id,canonical_name,block_code,alternate_name
MAP01,B01,RV Block,RV,Main Block
MAP02,B01,RV Block,RV,Administration Block
MAP03,B02,KS Block,KS,Engineering Block
MAP04,B03,BD Block,BD,JS-CH Block
MAP05,B03,BD Block,BD,AIML Block
```

### registration_process.csv (10 rows)

```csv
process_name,step_1,document,approval,office,block,availability
Hackathon Registration,Submit Google Form,Student ID,Faculty Approval,CSE Labs,RV Block,Open
Club Registration,Fill club form,Student ID,Club Coordinator Approval,Concerned Club,BD Block,Open
Library Membership,Submit application,Student ID,Library Verification,Library,RV Block,Open
Bus Pass,Apply at Transport Office,Fee Receipt,Transport Approval,Transport Office,RV Block,Open
Hostel Admission,Hostel Application,Admission Letter,Warden Approval,Hostel Office,RV Block,Seasonal
```

### rooms.csv (44 rows)

```csv
block,room_number,room_type
KS,KS-312,Classroom
KS,KS-313,Classroom
KS,KS-315,Classroom
KS,KS-316,Classroom
BD,BD-2-103,Classroom
```

### services/announcements.csv (15 rows)

```csv
announcement_id,title,description,category,target_audience,publish_date,expiry_date,priority,posted_by,related_event_id,last_updated
ANN001,Welcome to the 2026–27 Academic Year,The academic year 2026–27 begins on 15 July 2026. ...,academic,all,2026-07-10,2026-08-10,high,Principal Office,,2026-07-10
ANN002,First Year Orientation — 16 & 17 July 2026,All first-year students must attend the Freshers O...,academic,first_year,2026-07-10,2026-07-17,critical,Administrative Office,EVT001,2026-07-10
ANN003,Fee Payment Deadline — First Year Students,Fee payment for first-year students must be comple...,academic,first_year,2026-07-10,2026-07-31,high,Accounts Office,,2026-07-10
ANN004,Fee Payment Deadline — II, III and IV Year Student...,Returning students must complete fee payment by 5 ...,academic,all,2026-07-10,2026-08-05,high,Accounts Office,,2026-07-10
ANN005,AI Hackathon 2026 — Registrations Open,The AIML Department is organizing the AI Hackathon...,event,all,2026-07-15,2026-08-10,medium,AIML Department,EVT002,2026-07-15
```

### services/campus_services.csv (10 rows)

```csv
service_id,service_name,provider_office_id,building_id,process_id,fee_amount,processing_time,required_documents,description
SVC01,ID Card Issue,OFF02,B01,PROC07,0,2-3 working days,Student ID card. Apply at Administrative Office. B...,ID cards are issued by the Administrative Office, ...
SVC02,Fee Payment,OFF03,B01,PROC06,0,Immediate,Student ID, fee challan.,Semester fees are paid at the Accounts Office, RV ...
SVC03,Bonafide Certificate,OFF02,B01,PROC07,0,2 working days,Student ID, purpose letter.,Bonafide Certificates are issued by the Administra...
SVC04,Transcript,OFF04,B01,PROC10,200,5 working days,Fee receipt, student ID.,Official transcripts are issued by the Exam Cell, ...
SVC05,Placement Support,OFF05,B01,,0,Ongoing,Student ID, updated resume.,Placement Cell (first floor, RV Block) provides in...
```

### services/contacts.csv (12 rows)

```csv
contact_id,entity_type,entity_id,entity_name,email,phone,is_emergency,description
CON01,office,OFF01,Principal Office,principal@sce.edu,+91-9876540201,no,Contact the Principal Office for academic grievanc...
CON02,office,OFF02,Administrative Office,admin@sce.edu,+91-9876540202,no,Contact the Administrative Office for ID cards, bo...
CON03,office,OFF03,Accounts Office,accounts@sce.edu,+91-9876540203,no,Contact the Accounts Office for fee payment, recei...
CON04,office,OFF05,Placement Cell,placement@sce.edu,+91-9876540205,no,Contact the Placement Cell for campus recruitment,...
CON05,office,OFF04,Exam Cell,examcell@sce.edu,+91-9876540204,no,Contact the Exam Cell for exam schedules, hall tic...
```

### services/forms.csv (8 rows)

```csv
form_id,form_name,related_process_id,download_url,submission_office_id,description,last_updated
FRM01,Bus Pass Application Form,PROC04,https://forms.sce.edu/buspass,OFF08,Standard form to apply for a college bus pass. Ava...,2026-07-01
FRM02,Hostel Application Form,PROC05,https://forms.sce.edu/hostel,OFF02,Form to apply for on-campus hostel accommodation. ...,2026-07-01
FRM03,Bonafide Certificate Request,PROC07,https://forms.sce.edu/bonafide,OFF02,Online form to request a Bonafide Certificate from...,2026-07-01
FRM04,Transcript Request Form,PROC10,https://forms.sce.edu/transcript,OFF04,Form to request official academic transcripts from...,2026-07-01
FRM05,Library Membership Form,PROC03,https://forms.sce.edu/library,OFF07,Form to activate library membership and collect li...,2026-07-01
```

### services/it_onboarding.csv (5 rows)

```csv
onboarding_id,service_name,helpdesk_contact_id,default_credentials,reset_url,description
ITO01,Campus WiFi,CON10,Default password is your 10-digit date of birth (D...,https://wifi.sce.edu/reset,Campus WiFi is available across all academic block...
ITO02,College Email,CON10,Your college email is firstname.registernumber@stu...,https://mail.sce.edu/reset,Every student receives an official college email I...
ITO03,LMS Access,CON10,Log in with your register number and date of birth...,https://lms.sce.edu/reset,The Learning Management System (LMS) at lms.sce.ed...
ITO04,Student Portal,CON10,Login: register number. Password: date of birth (D...,https://portal.sce.edu/reset,The Student Portal at portal.sce.edu provides acce...
ITO05,Lab Systems,CON10,Lab PC login uses your register number as username...,,Campus computer labs use a centralized login syste...
```

### services/registration_process.csv (10 rows)

```csv
process_id,process_name,documents_required,approval_authority,office_id,building_id,fee_amount,online_form_url,availability,turnaround_days,description,last_updated
PROC01,Hackathon Registration,Student ID card, college email confirmation,Faculty Coordinator Approval,OFF09,B01,200,https://forms.sce.edu/hackathon,open,1,To register for a college hackathon: collect the e...,2026-07-01
PROC02,Club Registration,Student ID card,Club Coordinator Approval,OFF09,B03,0,https://forms.sce.edu/clubs,open,2,To join a club: attend the club's open house sessi...,2026-07-01
PROC03,Library Membership,Student ID card, department letter,Library Verification,OFF07,B01,0,https://forms.sce.edu/library,open,1,Library membership is automatically activated when...,2026-07-01
PROC04,Bus Pass Application,Student ID, fee receipt, address proof,Transport Office Approval,OFF08,B01,400,https://forms.sce.edu/buspass,open,3,Apply for a bus pass at the Transport Office (grou...,2026-07-01
PROC05,Hostel Admission,Admission letter, parent signature, medical certif...,Warden Approval,OFF02,B09,0,https://forms.sce.edu/hostel,seasonal,5,Hostel applications are processed before semester ...,2026-07-01
```

### services/student_support.csv (6 rows)

```csv
support_id,service_type,service_name,contact_name,phone,email,building_id,room_id,availability_hours,description
SUP01,grievance,Student Grievance Cell,Dr. V. Ramachandran (Principal),9876540201,principal@sce.edu,B01,R001,Mon-Fri 09:00-17:00,The Student Grievance Cell is headed by the Princi...
SUP02,anti_ragging,Anti-Ragging Committee,Dr. S. Ganesh (Anti-Ragging Coordinator),1800-180-5522,antiragging@sce.edu,B01,R001,24x7,The Anti-Ragging Committee is a zero-tolerance bod...
SUP03,counseling,Student Counseling Centre,Ms. A. Preethi (Counselor),9876540250,counseling@sce.edu,B01,R002,Mon-Fri 09:00-17:00,Free counseling services are available for all stu...
SUP04,medical,Medical Room,Campus Nurse,9876540209,medical@sce.edu,B01,R006,Mon-Fri 09:00-16:00,First-aid and basic health services are provided a...
SUP05,security,Campus Security,Mr. J. Arumugam (Security Head),9876540100,security@sce.edu,B06,,24x7,Campus security operates 24x7. Security personnel ...
```

### timetable.csv (140 rows)

```csv
department,year,section,day,period,time,subject,room
AIML,III,A,Monday,P1,09:00-09:50,Machine Learning,BD-2-301
AIML,III,A,Monday,P2,09:50-10:40,Data Structures,BD-2-301
AIML,III,A,Monday,P3,10:55-11:45,AI Lab,BD-2-301
AIML,III,A,Monday,P4,11:45-12:35,DBMS,BD-2-301
AIML,III,A,Monday,P5,01:20-02:10,Lunch,BD-2-301
```
