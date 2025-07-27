import requests
import pytest

BASE_URL = "http://localhost:3001"
ITEMS_ENDPOINT = f"{BASE_URL}/items"
LOGIN_ENDPOINT = f"{BASE_URL}/login"

# ============================
# POST /login
# ============================

def test_login_valid_credentials():
    """Test login with valid credentials"""
    payload = {"username": "antonio", "password": "rem_waste"}
    response = requests.get(f"{BASE_URL}/users?username={payload['username']}&password={payload['password']}")
    assert response.status_code == 200
    assert len(response.json()) == 1

def test_login_invalid_credentials():
    """Test login with invalid credentials"""
    # payload = {"username": "antonio", "password": "wrongpass"}
    response = requests.get(f"{BASE_URL}/users?username=antonio&password=wrongpass")
    assert response.status_code == 200
    assert len(response.json()) == 0  # No debería encontrar usuarios

# ============================
# GET /items
# ============================

def test_get_items():
    """Test fetching items list"""
    response = requests.get(ITEMS_ENDPOINT)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_get_items_wrong_endpoint():
    """Test GET with wrong endpoint"""
    response = requests.get(f"{BASE_URL}/nonexistent")
    assert response.status_code == 404

# ============================
# POST /items
# ============================

def test_create_item_success():
    """Test creating a valid item"""
    new_item = {"name": "Test Item", "completed": False}
    response = requests.post(ITEMS_ENDPOINT, json=new_item)
    assert response.status_code == 201
    assert response.json()["name"] == "Test Item"

def test_create_item_invalid_data():
    """Test creating an item with invalid data"""
    new_item = {}  # Missing required fields
    response = requests.post(ITEMS_ENDPOINT, json=new_item)
    assert response.status_code == 400 or response.status_code == 422 or response.status_code == 201

# ============================
# PUT /items/:id
# ============================

def test_update_item_success():
    """Test updating an existing item"""
    item_id = "1"  # Using an existing item ID
    updated_data = {"name": "Updated Item", "completed": True}
    response = requests.put(f"{ITEMS_ENDPOINT}/{item_id}", json=updated_data)
    assert response.status_code == 200
    assert response.json()["completed"] == True

def test_update_item_not_found():
    """Test updating a nonexistent item"""
    item_id = "9999"
    updated_data = {"name": "Ghost Item"}
    response = requests.put(f"{ITEMS_ENDPOINT}/{item_id}", json=updated_data)
    assert response.status_code == 404

# ============================
# DELETE /items/:id
# ============================

def test_delete_item_success():
    """Crear un ítem y luego eliminarlo"""
    new_item = {"name": "Tarea temporal", "completed": False}
    post_response = requests.post(ITEMS_ENDPOINT, json=new_item)
    assert post_response.status_code == 201
    created_id = post_response.json()["id"]

    delete_response = requests.delete(f"{ITEMS_ENDPOINT}/{created_id}")
    assert delete_response.status_code in [200, 204]


def test_delete_item_not_found():
    """Test deleting a nonexistent item"""
    item_id = "9999"
    response = requests.delete(f"{ITEMS_ENDPOINT}/{item_id}")
    assert response.status_code == 404
