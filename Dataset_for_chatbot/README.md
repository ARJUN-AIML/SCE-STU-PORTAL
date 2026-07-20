# SCE Student Portal AI Chatbot Dataset

This repository contains the complete dataset for the SCE Student Portal Freshers Portal AI Chatbot (Google Student Ambassador Hackathon Demo).

## Architecture
The dataset is structured across 6 domain folders and 1 junction folder, fully normalized to 3NF (Third Normal Form) to eliminate data duplication and optimize for RAG (Retrieval-Augmented Generation) based embeddings.

There are 39 CSV files in total, representing a comprehensive but lightweight mock college ecosystem.

## Directory Structure

### 1. `core/`
The foundational entities of the campus.
* `buildings.csv`: Campus buildings, gates, and grounds.
* `departments.csv`: Academic departments (CSE, AIML, etc.).
* `rooms.csv`: Classrooms, labs, and seminar halls across buildings.
* `offices.csv`: Administrative and department offices.
* `faculty.csv`: Teaching staff and HODs.
* `student_profiles.csv`: A sample of 75 student profiles.
* `subject_master.csv`: Theory and lab courses offered by departments.

### 2. `academic/`
Academic scheduling and curriculum data.
* `academic_calendar.csv`: Deadlines, exams, and holidays.
* `fees_structure.csv`: Tuition and lab fee breakdowns by department and year.
* `exam_schedule.csv`: Internal assessment dates, times, and venues.
* `timetable.csv`: Daily class and lab schedules.

### 3. `campus/`
Campus life, navigation, and amenities.
* `facilities.csv`: Canteen, library, medical, WiFi, and parking.
* `navigation.csv`: Bidirectional walking directions and distances between buildings.
* `hostel.csv`: Men's and Women's hostel details, rules, and capacities.
* `transport_routes.csv`: Bus routes covering the city.
* `canteen_menu.csv`: Daily and weekly canteen food menus.
* `library_books.csv`: Sample of library textbooks available for borrowing.

### 4. `activities/`
Extracurriculars and career development.
* `clubs.csv`: Technical, cultural, and sports clubs.
* `events.csv`: Hackathons, symposiums, orientations, and workshops.
* `placement_drives.csv`: Upcoming campus recruitment by tech companies.

### 5. `services/`
Student services, support, and administrative processes.
* `registration_process.csv`: How to apply for bus pass, hostel, bonafide, etc.
* `campus_services.csv`: Quick-lookup for services and turnaround times.
* `contacts.csv`: Email and phone directory for offices and emergency services.
* `forms.csv`: Links to download required forms.
* `student_support.csv`: Anti-ragging, counseling, and grievance cells.
* `it_onboarding.csv`: WiFi, Email, LMS, and Student Portal setup instructions.
* `announcements.csv`: Recent college announcements and notices.

### 6. `reference/`
Semantic routing layer for the AI chatbot.
* `id_mapping.csv`: Maps casual building names (e.g., "JS-CH") to Canonical IDs.
* `aliases.csv`: Common abbreviations for departments, clubs, and facilities.
* `entity_keywords.csv`: Semantic search terms to aid RAG embeddings.
* `faq.csv`: Pre-answered frequently asked questions about the campus.
* `equipment.csv`: Equipment available in rooms and labs.

### 7. `junction/`
Mapping tables for Many-to-Many relationships.
* `club_membership.csv`: Maps students to clubs with their roles.
* `faculty_subjects.csv`: Maps faculty to the subjects they teach.
* `it_onboarding_steps.csv`: Step-by-step instructions for IT setup.
* `placement_drive_eligibility.csv`: Maps departments to eligible placement drives.
* `registration_steps.csv`: Step-by-step instructions for administrative processes.
* `room_equipment.csv`: Maps inventory (projectors, PCs) to specific rooms.
* `transport_stops.csv`: Stop sequence and timings for each bus route.

## Canonical ID Strategy
Every entity has a stable `id` which acts as the primary key. Foreign keys point to these IDs rather than string names to ensure consistency across the dataset.
* `B##` (Buildings)
* `D##` (Departments)
* `R###` (Rooms)
* `F###` (Faculty)
* `STU####` (Students)
* `SUB###` (Subjects)
* `C###` (Clubs)

## Generation Scripts
* `generate_data.py`: Run this python script to generate all 39 CSV files with realistic demo data.
* `verify_dataset.py`: Run this python script to check for foreign key integrity, missing files, and duplicate primary keys.