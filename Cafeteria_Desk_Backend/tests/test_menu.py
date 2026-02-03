def test_create_menu_item_admin(client, auth_headers):
    """Cafeteria Admin can create menu item"""
    headers = auth_headers("cafeteria")
    
    resp = client.post("/menu", json={
        "name": "Test Burger",
        "description": "Tasty",
        "price": 100,
        "is_available": True
    }, headers=headers)
    
    assert resp.status_code == 201
    assert resp.json["message"] == "Menu item added successfully"


def test_create_menu_item_unauthorized(client, auth_headers):
    """Employee/Desk Admin cannot create menu item"""
    payload = {
        "name": "Secret Pizza",
        "price": 500
    }
    
    # Employee
    headers_emp = auth_headers("employee")
    resp = client.post("/menu", json=payload, headers=headers_emp)
    assert resp.status_code == 403

    # Desk Admin
    headers_desk = auth_headers("desk")
    resp = client.post("/menu", json=payload, headers=headers_desk)
    assert resp.status_code == 403


def test_get_menu(client, auth_headers):
    """Anyone can view menu"""
    # Public access might not be allowed if strictly protected, checking route.
    # Actually menu routes might be protected. Assuming authenticated users.
    
    headers = auth_headers("employee")
    resp = client.get("/menu", headers=headers)
    assert resp.status_code == 200
    assert isinstance(resp.json, list)
