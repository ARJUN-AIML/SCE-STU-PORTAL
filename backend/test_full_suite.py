import sys
import os
from fastapi.testclient import TestClient

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from api import app
from database.config import get_db, SessionLocal
from auth.firebase import require_current_user, require_current_admin
from models.models import User, Event, ClubRegistration, Notice, Department, Faculty, TransportRoute, Building, LibraryBook

client = TestClient(app)

# Mock Auth Dependencies
class MockUser:
    id = 1
    firebase_uid = "test_student_uid_123"
    email = "test.student@saranathan.ac.in"
    name = "Test Student"
    role = "student"

class MockAdmin:
    id = 2
    firebase_uid = "test_admin_uid_456"
    email = "test.admin@saranathan.ac.in"
    name = "Test Admin"
    role = "admin"

def override_require_current_user():
    return MockUser()

def override_require_current_admin():
    return MockAdmin()

app.dependency_overrides[require_current_user] = override_require_current_user
app.dependency_overrides[require_current_admin] = override_require_current_admin

def log_test(name, passed, details=""):
    status = "PASSED" if passed else "FAILED"
    print(f"[{status}] {name} {details}")
    assert passed, f"Test failed: {name} - {details}"

def run_all_qa_tests():
    print("=========================================================")
    print("   STARTING COMPREHENSIVE QA TEST SUITE (BACKEND & DB)")
    print("=========================================================\n")
    
    # ----------------------------------------------------
    # 1. HEALTH & METRICS
    # ----------------------------------------------------
    r = client.get("/health")
    log_test("GET /health", r.status_code == 200, f"Status: {r.json().get('status')}")

    r = client.get("/metrics")
    log_test("GET /metrics", r.status_code == 200)

    # ----------------------------------------------------
    # 2. PUBLIC DATA ROUTERS
    # ----------------------------------------------------
    r = client.get("/events")
    log_test("GET /events", r.status_code == 200, f"Count: {len(r.json().get('data', []))}")
    if r.json().get("data"):
        event_id = r.json()["data"][0]["id"]
        r_single = client.get(f"/events/{event_id}")
        log_test(f"GET /events/{event_id}", r_single.status_code == 200)

    r = client.get("/notices")
    log_test("GET /notices", r.status_code == 200, f"Count: {len(r.json().get('data', []))}")

    r = client.get("/departments")
    log_test("GET /departments", r.status_code == 200, f"Count: {len(r.json().get('data', []))}")

    r = client.get("/faculty")
    log_test("GET /faculty", r.status_code == 200, f"Count: {len(r.json().get('data', []))}")

    r = client.get("/timetable")
    log_test("GET /timetable", r.status_code == 200)

    r = client.get("/transport")
    log_test("GET /transport", r.status_code == 200, f"Count: {len(r.json().get('data', []))}")

    r = client.get("/library")
    log_test("GET /library", r.status_code == 200)

    r = client.get("/buildings")
    log_test("GET /buildings", r.status_code == 200)

    # ----------------------------------------------------
    # 3. CLUB REGISTRATIONS
    # ----------------------------------------------------
    # Valid email
    valid_club_payload = {
        "student_name": "QA Tester",
        "batch_no": "2023-2027",
        "department": "AIML",
        "year": "III",
        "mobile_number": "9876543210",
        "college_email": "qa.tester@saranathan.ac.in",
        "club_name": "Robotics Club"
    }
    r = client.post("/clubs/register", json=valid_club_payload)
    log_test("POST /clubs/register (Valid Email)", r.status_code == 200 and r.json().get("success") is True)
    reg_id = r.json().get("data", {}).get("id")

    # Invalid email check
    invalid_club_payload = {**valid_club_payload, "college_email": "tester@gmail.com"}
    r = client.post("/clubs/register", json=invalid_club_payload)
    log_test("POST /clubs/register (Invalid Email Validation)", r.status_code == 422, "Correctly rejected invalid email domain")

    # Admin List Club Registrations
    r = client.get("/clubs/admin/registrations")
    log_test("GET /clubs/admin/registrations", r.status_code == 200, f"Count: {len(r.json().get('data', []))}")

    # Admin Patch Registration Status
    if reg_id:
        r = client.patch(f"/clubs/admin/registrations/{reg_id}/status", json={"status": "Approved"})
        log_test(f"PATCH /clubs/admin/registrations/{reg_id}/status", r.status_code == 200 and r.json().get("success") is True)

    # ----------------------------------------------------
    # 4. EVENT REGISTRATIONS
    # ----------------------------------------------------
    # Query an open event
    r_events = client.get("/events")
    events_list = r_events.json().get("data", [])
    open_events = [e for e in events_list if e.get("status") == "open"]
    
    if open_events:
        target_event = open_events[0]
        event_reg_payload = {
            "event_id": str(target_event["id"]),
            "name": "QA Student",
            "email": "qa.student@saranathan.ac.in",
            "rollNumber": "23AIML099",
            "notes": "Testing event registration"
        }
        r = client.post("/register", json=event_reg_payload)
        # 200 or 409 (if already registered) are both valid success states
        log_test("POST /register (Event Registration)", r.status_code in [200, 409], f"Response code: {r.status_code}")

    r = client.get("/my-registrations")
    log_test("GET /my-registrations", r.status_code == 200)

    # ----------------------------------------------------
    # 5. AI CHATBOT & FAQ ENGINE
    # ----------------------------------------------------
    chat_queries = [
        "What are the library timings?",
        "How do I contact the CSE HOD?",
        "When is the upcoming symposium?"
    ]
    for q in chat_queries:
        r = client.post("/chat", json={"question": q})
        log_test(f"POST /chat ('{q}')", r.status_code == 200 and len(r.json().get("answer", "")) > 0)

    # ----------------------------------------------------
    # 6. ADMIN CMS OPERATIONS (CRUD TEST)
    # ----------------------------------------------------
    # Create test notice
    notice_payload = {
        "title": "QA Test Notice",
        "content": "This is an automated QA test notice.",
        "type": "general",
        "category": "General",
        "priority": "high",
        "author": "QA Team"
    }
    r = client.post("/admin/notices", json=notice_payload)
    log_test("POST /admin/notices (Create Notice)", r.status_code == 200 and r.json().get("success") is True)
    created_notice_id = r.json().get("data", {}).get("id")

    if created_notice_id:
        r = client.delete(f"/admin/notices/{created_notice_id}")
        log_test(f"DELETE /admin/notices/{created_notice_id}", r.status_code == 200 and r.json().get("success") is True)

    print("\n=========================================================")
    print("   ALL BACKEND QA TEST CASES PASSED WITH 100% SUCCESS!")
    print("=========================================================")

if __name__ == "__main__":
    run_all_qa_tests()
