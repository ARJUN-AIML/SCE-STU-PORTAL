from fastapi.testclient import TestClient
from api import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    print("\n[HEALTH TEST]:", data)
    assert "status" in data
    assert "database" in data

def test_chat():
    response = client.post("/chat", json={"question": "What are the library timings?"})
    assert response.status_code == 200
    data = response.json()
    answer_text = data.get("answer", "")[:100].encode('ascii', 'ignore').decode('ascii')
    print("\n[CHAT TEST]:", answer_text)
    assert "answer" in data
    assert len(data["answer"]) > 0

def test_club_registration():
    payload = {
        "student_name": "John Doe",
        "batch_no": "2023-2027",
        "department": "CSE",
        "year": "II",
        "mobile_number": "9876543210",
        "college_email": "john.doe@saranathan.ac.in",
        "club_name": "Coding Club"
    }
    response = client.post("/clubs/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    print("\n[CLUB REGISTRATION TEST]:", data)
    assert data["success"] is True

if __name__ == "__main__":
    test_health()
    test_club_registration()
    test_chat()
    print("\n[SUCCESS] ALL E2E ENDPOINT TESTS PASSED SUCCESSFULLY!")
