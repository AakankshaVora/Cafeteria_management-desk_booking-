def test_place_order(client, auth_headers, db_session):
    """Employee places an order"""
    # Create menu item directly in DB for test
    from app.models.menu_item import MenuItem
    item = MenuItem(name="Fries", price=50, is_available=True)
    db_session.add(item)
    db_session.commit()
    
    headers = auth_headers("employee")
    resp = client.post("/orders", json={
        "items": [{"item_id": item.id, "quantity": 2}]
    }, headers=headers)
    
    assert resp.status_code == 201
    assert resp.json["total_amount"] == 100

def test_scheduled_order(client, auth_headers, db_session):
    """Test scheduled order"""
    from app.models.menu_item import MenuItem
    from datetime import datetime, timedelta
    
    item = MenuItem(name="Pizza", price=200, is_available=True)
    db_session.add(item)
    db_session.commit()
    
    headers = auth_headers("employee")
    future_time = (datetime.now() + timedelta(hours=2)).isoformat()
    
    resp = client.post("/orders", json={
        "items": [{"item_id": item.id, "quantity": 1}],
        "scheduled_time": future_time
    }, headers=headers)
    
    assert resp.status_code == 201

def test_past_scheduled_order_fails(client, auth_headers, db_session):
    """Test past scheduled order fails"""
    from app.models.menu_item import MenuItem
    from datetime import datetime, timedelta
    
    item = MenuItem(name="Burger", price=100, is_available=True)
    db_session.add(item)
    db_session.commit()
    
    headers = auth_headers("employee")
    past_time = (datetime.now() - timedelta(hours=2)).isoformat()
    
    resp = client.post("/orders", json={
        "items": [{"item_id": item.id, "quantity": 1}],
        "scheduled_time": past_time
    }, headers=headers)
    
    assert resp.status_code == 400
    assert "time cannot be in the past" in resp.json["message"]


def test_update_order_status(client, auth_headers, db_session):
    """Cafeteria Admin completes order"""
    # Create pending order
    from app.models.order import Order
    from app.models.user import User
    user = db_session.query(User).filter_by(role="employee").first()
    order = Order(user_id=user.id, total_amount=100.0, status="pending")
    db_session.add(order)
    db_session.commit()
    
    headers = auth_headers("cafeteria")
    resp = client.put(f"/orders/{order.id}/status", json={
        "status": "completed"
    }, headers=headers)
    
    assert resp.status_code == 200
    assert resp.json["new_status"] == "completed"

def test_desk_admin_cannot_access_orders(client, auth_headers):
    """Desk Admin denied access to orders"""
    headers = auth_headers("desk")
    resp = client.get("/orders", headers=headers)
    assert resp.status_code == 403
