from fastapi.testclient import TestClient

from .main import app

client = TestClient(app)

def test_create_user():
    payload = {"full_name": "testuser", "email": "testuser@example.com", "password": "testpassword"}
    response = client.post("/users/", json=payload)
    assert response.status_code == 200
    assert response.json()["full_name"] == "testuser"
    assert response.json()["email"] == "testuser@example.com"

def test_read_user():
    response = client.get("/users/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_read_users():
    response = client.get("/users/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_keyword():
    payload = {"name": "testkeyword", "type": "dropdown-menu", "options": ["option1", "option2"], "description": "This is a test keyword."}
    response = client.post("/keywords/", json=payload)
    assert response.status_code == 200
    assert response.json()["name"] == "testkeyword"
    assert response.json()["type"] == "dropdown-menu"
    assert response.json()["options"] == ["option1", "option2"]
    assert response.json()["description"] == "This is a test keyword."

def test_read_keyword():
    response = client.get("/keywords/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_read_keywords():
    response = client.get("/keywords/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_read_keyword_types():
    response = client.get("/keyword_types/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_project():
    payload = {"name": "testproject"}
    response = client.post("/projects/", json=payload)
    assert response.status_code == 200
    assert response.json()["name"] == "testproject"

def test_read_project():
    response = client.get("/projects/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_read_projects():
    response = client.get("/projects/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_email_template():
    payload = {"name": "testtemplate", "body": "This is a test template."}
    response = client.post("/email_templates/", json=payload)
    assert response.status_code == 200
    assert response.json()["name"] == "testtemplate"

def test_read_email_template():
    response = client.get("/email_templates/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_read_email_templates():
    response = client.get("/email_templates/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)