from fastapi.testclient import TestClient
from api import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert data["status"] in ["ok", "ready", "live"]

def test_chat_endpoint_missing_body():
    response = client.post("/chat", json={})
    assert response.status_code == 422 # Unprocessable Entity
