from datetime import date

def test_create_desk(client, auth_headers):
    """Desk Admin creates desk"""
    headers = auth_headers("desk")
    resp = client.post("/desks", json={
        "desk_code": "D-101",
        "location": "Test Location",
        "status": "available"
    }, headers=headers)
    
    assert resp.status_code == 201
    assert resp.json["message"] == "Desk created successfully"

def test_book_desk(client, auth_headers, db_session):
    """Employee books a desk"""
    from app.models.desk import Desk
    desk = Desk(desk_code="D-202", location="Floor 2", status="available")
    db_session.add(desk)
    db_session.commit()
    print(f"DEBUG: Created Desk ID: {desk.id}, Code: {desk.desk_code}")
    
    headers = auth_headers("employee")
    resp = client.post("/desk-bookings", json={
        "desk_id": desk.id,
        "booking_date": str(date.today())
    }, headers=headers)
    print(f"DEBUG: Response Status: {resp.status_code}, Body: {resp.json}")
    
    assert resp.status_code == 201
    assert resp.json["message"] == "Desk booked successfully"

def test_double_booking_prevention(client, auth_headers, db_session):
    """Prevent double booking same desk same day"""
    from app.models.desk import Desk
    desk = Desk(desk_code="D-303", location="Floor 3", status="available")
    db_session.add(desk)
    db_session.commit()
    
    headers = auth_headers("employee")
    payload = {
        "desk_id": desk.id,
        "booking_date": "2025-01-01"
    }
    
    # First booking
    resp1 = client.post("/desk-bookings", json=payload, headers=headers)
    assert resp1.status_code == 201
    
    # Second booking (Same user or another)
    resp2 = client.post("/desk-bookings", json=payload, headers=headers)
    assert resp2.status_code == 400
    assert "already booked" in resp2.json["message"]
