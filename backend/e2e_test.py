import asyncio
from fastapi.testclient import TestClient
from api import app
from database.config import SessionLocal, Base, engine
from models.models import User, Event

def setup_test_data():
    db = SessionLocal()
    # Ensure dev-user exists
    user = db.query(User).filter(User.firebase_uid == "test-student-uid").first()
    if not user:
        user = User(firebase_uid="test-student-uid", email="student@saranathan.ac.in", name="Test Student", role="student")
        db.add(user)
    
    # Ensure admin exists
    admin = db.query(User).filter(User.firebase_uid == "test-admin-uid").first()
    if not admin:
        admin = User(firebase_uid="test-admin-uid", email="admin@sceadmin.ac.in", name="Test Admin", role="admin")
        db.add(admin)

    # Ensure an event exists
    event = db.query(Event).filter(Event.title == "Test Event E2E").first()
    if not event:
        event = Event(title="Test Event E2E", status="open", seats_total=10, seats_filled=0)
        db.add(event)
    
    db.commit()
    db.refresh(event)
    db.close()
    return event.id

# Dependency overrides
from auth.firebase import require_current_user

def override_require_student():
    return User(firebase_uid="test-student-uid", email="student@saranathan.ac.in", role="student", id=999)

def override_require_admin():
    return User(firebase_uid="test-admin-uid", email="admin@sceadmin.ac.in", role="admin", id=1000)

app.dependency_overrides[require_current_user] = override_require_student
client = TestClient(app)

event_id = setup_test_data()

print("1. Registering student for event...")
reg_payload = {
    "event_id": str(event_id),
    "name": "Test Student",
    "email": "student@saranathan.ac.in",
    "rollNumber": "123456",
    "notes": "E2E Test Note"
}
res = client.post("/register", json=reg_payload)
print("POST /register:", res.status_code, res.json())

print("\n2. Trying duplicate registration...")
res2 = client.post("/register", json=reg_payload)
print("POST /register (Duplicate):", res2.status_code, res2.json())

print("\n3. Fetching /my-registrations...")
res3 = client.get("/my-registrations")
print("GET /my-registrations:", res3.status_code, len(res3.json().get('data', [])))

print("\n4. Fetching Admin endpoint...")
app.dependency_overrides[require_current_user] = override_require_admin
res4 = client.get(f"/admin/events/{event_id}/registrations")
print(f"GET /admin/events/{event_id}/registrations:", res4.status_code, len(res4.json().get('data', [])))

# Clean up
db = SessionLocal()
db.execute("DELETE FROM registrations WHERE event_id = :eid", {"eid": str(event_id)})
db.execute("DELETE FROM events WHERE id = :eid", {"eid": event_id})
db.commit()
db.close()
