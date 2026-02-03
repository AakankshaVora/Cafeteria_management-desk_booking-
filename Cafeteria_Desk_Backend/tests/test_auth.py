def test_login_success(client, test_users):
    """Test login for all roles"""
    
    # Employee
    resp = client.post("/auth/login", json={
        "email": "emp@test.com",
        "password": "password"
    })
    assert resp.status_code == 200
    data = resp.json
    assert "access_token" in data
    assert data["user"]["role"] == "employee"

    # Cafeteria Admin
    resp = client.post("/auth/login", json={
        "email": "cafe@test.com",
        "password": "password"
    })
    assert resp.status_code == 200
    assert resp.json["user"]["role"] == "cafeteria_admin"

    # Desk Admin
    resp = client.post("/auth/login", json={
        "email": "desk@test.com",
        "password": "password"
    })
    assert resp.status_code == 200
    assert resp.json["user"]["role"] == "desk_admin"


def test_login_failure(client, test_users):
    """Test invalid credentials"""
    
    # Wrong Password
    resp = client.post("/auth/login", json={
        "email": "emp@test.com",
        "password": "wrongpassword"
    })
    assert resp.status_code == 401
    
    # Wrong Email
    resp = client.post("/auth/login", json={
        "email": "ghost@test.com",
        "password": "password"
    })
    assert resp.status_code == 401


def test_protected_route_access(client):
    """Test access without token"""
    resp = client.get("/auth/profile")
    assert resp.status_code == 401
