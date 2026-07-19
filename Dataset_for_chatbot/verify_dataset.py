"""
verify_dataset.py
Validates the CampusOS AI Chatbot dataset for foreign key integrity,
missing files, empty files, and duplicate primary keys.
Run: python verify_dataset.py
"""

import os
import csv
from collections import defaultdict

BASE = os.path.dirname(os.path.abspath(__file__))

# Define expected files and their Primary Key columns
EXPECTED_FILES = {
    "core/buildings.csv": "building_id",
    "core/departments.csv": "department_id",
    "core/rooms.csv": "room_id",
    "core/faculty.csv": "faculty_id",
    "core/subject_master.csv": "subject_id",
    "core/offices.csv": "office_id",
    "core/student_profiles.csv": "student_id",
    "academic/academic_calendar.csv": "calendar_id",
    "academic/fees_structure.csv": "fee_id",
    "academic/exam_schedule.csv": "exam_id",
    "academic/timetable.csv": "timetable_id",
    "campus/facilities.csv": "facility_id",
    "campus/navigation.csv": "edge_id",
    "campus/hostel.csv": "hostel_id",
    "campus/transport_routes.csv": "route_id",
    "campus/canteen_menu.csv": "menu_id",
    "campus/library_books.csv": "book_id",
    "activities/clubs.csv": "club_id",
    "activities/events.csv": "event_id",
    "activities/placement_drives.csv": "drive_id",
    "services/registration_process.csv": "process_id",
    "services/campus_services.csv": "service_id",
    "services/contacts.csv": "contact_id",
    "services/forms.csv": "form_id",
    "services/student_support.csv": "support_id",
    "services/it_onboarding.csv": "onboarding_id",
    "services/announcements.csv": "announcement_id",
    "reference/equipment.csv": "equipment_id",
    "reference/id_mapping.csv": "mapping_id",
    "reference/aliases.csv": "alias_id",
    "reference/entity_keywords.csv": "keyword_id",
    "reference/faq.csv": "faq_id",
    "junction/transport_stops.csv": None, # Composite PK
    "junction/registration_steps.csv": None, # Composite PK
    "junction/it_onboarding_steps.csv": None, # Composite PK
    "junction/faculty_subjects.csv": None, # Composite PK
    "junction/room_equipment.csv": None, # Composite PK
    "junction/club_membership.csv": None, # Composite PK
    "junction/placement_drive_eligibility.csv": None, # Composite PK
}

def check_file_exists(rel_path):
    return os.path.exists(os.path.join(BASE, rel_path))

def read_csv(rel_path):
    path = os.path.join(BASE, rel_path)
    if not os.path.exists(path): return []
    with open(path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        return list(reader)

def verify():
    print("=== CampusOS Dataset Verification ===\n")
    all_good = True
    datasets = {}

    # 1. Check Files & Read Data
    print("--- 1. File Presence & Volume Check ---")
    for rel_path, pk_col in EXPECTED_FILES.items():
        if not check_file_exists(rel_path):
            print(f"[FAIL] Missing file: {rel_path}")
            all_good = False
            continue
        
        data = read_csv(rel_path)
        if len(data) == 0:
            print(f"[WARN] Empty file: {rel_path}")
        else:
            print(f"[OK] {rel_path} ({len(data)} rows)")
        datasets[rel_path] = data
    print()

    # 2. Check Primary Keys
    print("--- 2. Primary Key Uniqueness ---")
    entity_ids = {} # Store all valid IDs for FK checking
    for rel_path, pk_col in EXPECTED_FILES.items():
        if pk_col and rel_path in datasets:
            seen = set()
            data = datasets[rel_path]
            entity_ids[pk_col] = set()
            for row_idx, row in enumerate(data):
                val = row.get(pk_col)
                if not val:
                    print(f"[FAIL] {rel_path} row {row_idx+1} missing PK {pk_col}")
                    all_good = False
                elif val in seen:
                    print(f"[FAIL] {rel_path} duplicate PK {val}")
                    all_good = False
                else:
                    seen.add(val)
                    entity_ids[pk_col].add(val)
    print("[OK] Primary keys validated.\n" if all_good else "[!] Primary key issues found.\n")

    # 3. Check Foreign Keys (General approach based on column names)
    print("--- 3. Foreign Key Integrity ---")
    fk_errors = 0
    # Mapping of column suffix to the PK dictionary key
    fk_map = {
        "building_id": "building_id",
        "department_id": "department_id",
        "room_id": "room_id",
        "faculty_id": "faculty_id",
        "student_id": "student_id",
        "subject_id": "subject_id",
        "club_id": "club_id",
        "process_id": "process_id",
        "event_id": "event_id",
        "office_id": "office_id",
        "hostel_id": "hostel_id",
        "route_id": "route_id",
        "equipment_id": "equipment_id",
        "drive_id": "drive_id",
        "onboarding_id": "onboarding_id"
    }

    # Special handling for column names that don't directly match
    special_fk = {
        "hod_faculty_id": "faculty_id",
        "cabin_room_id": "room_id",
        "hall_room_id": "room_id",
        "source_building_id": "building_id",
        "dest_building_id": "building_id",
        "nearest_building_id": "building_id",
        "meeting_building_id": "building_id",
        "meeting_room_id": "room_id",
        "coordinator_faculty_id": "faculty_id",
        "lead_student_id": "student_id",
        "venue_room_id": "room_id",
        "venue_building_id": "building_id",
        "organizer_department_id": "department_id",
        "organizer_club_id": "club_id",
        "registration_process_id": "process_id",
        "tpo_contact_id": "contact_id",
        "provider_office_id": "office_id",
        "submission_office_id": "office_id",
        "helpdesk_contact_id": "contact_id",
        "related_event_id": "event_id",
        "advisor_faculty_id": "faculty_id",
        "current_room_id": "room_id",
        "transport_route_id": "route_id"
    }

    for rel_path, data in datasets.items():
        if not data: continue
        headers = data[0].keys()
        
        for col in headers:
            target_pk = None
            if col in special_fk:
                target_pk = special_fk[col]
            elif col in fk_map and col != EXPECTED_FILES.get(rel_path): 
                # If column name implies a FK and it's not the PK of this table
                target_pk = fk_map[col]
            
            if target_pk and target_pk in entity_ids:
                valid_ids = entity_ids[target_pk]
                for row_idx, row in enumerate(data):
                    val = row.get(col)
                    # Allow empty foreign keys (nullables)
                    if val and val not in valid_ids:
                        print(f"[FAIL] {rel_path} row {row_idx+1}: invalid FK '{val}' in '{col}' (expected a valid {target_pk})")
                        fk_errors += 1
                        all_good = False

    if fk_errors == 0:
        print("[OK] All foreign keys validated successfully.")
    else:
        print(f"[!] Found {fk_errors} foreign key resolution errors.")

    print("\n=== Verification Complete ===")
    if all_good:
        print("Verdict: DATASET IS VALID AND READY FOR DEMO.")
    else:
        print("Verdict: DATASET CONTAINS ERRORS. Review logs above.")

if __name__ == "__main__":
    verify()
