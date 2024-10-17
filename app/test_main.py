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
    payload = {"name": "testkeyword", "type": "Dropdown Menu", "options": ["option1", "option2"]}
    response = client.post("/keywords/", json=payload)
    assert response.status_code == 200
    assert response.json()["name"] == "testkeyword"
    assert response.json()["type"] == "Dropdown Menu"
    assert response.json()["options"] == ["option1", "option2"]

def test_read_keyword():
    response = client.get("/get-keywords/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_read_keywords():
    response = client.get("/get-keywords/")
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
    keywords = [
        {
            "id": 1,
            "name": "keyword1",
            "type": "Dropdown Menu",
            "options": ["option1", "option2"],
        },
        {
            "id": 2,
            "name": "keyword2",
            "type": "Input Field",
            "options": [],
        }
    ]

    payload = {
        "name": "testtemplate",
        "body": "This is a test template.",
        "keywords": keywords
    }

    response = client.post("/email_templates/", json=payload)
    print(response.json())
    assert response.status_code == 200
    assert response.json()["name"] == "testtemplate"
    # assert response.json()["keywords"][0]["name"] == "keyword1"
    # assert response.json()["keywords"][1]["name"] == "keyword2"

def test_read_email_template():
    response = client.get("/get-email_templates/1")
    assert response.status_code == 200
    assert response.json()["id"] == 1

def test_read_email_templates():
    response = client.get("/get-email_templates/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)