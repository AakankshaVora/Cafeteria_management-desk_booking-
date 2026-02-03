import requests
import datetime

BASE_URL = "http://127.0.0.1:5000"

def run():
    session = requests.Session()
    email = f"debug_{datetime.datetime.now().timestamp()}@test.com"
    password = "password123"

    # 1. Register
    print(f"Registering {email}...")
    resp = session.post(f"{BASE_URL}/auth/register", json={
        "name": "Debug User",
        "email": email,
        "password": password,
        "role": "employee"
    })
    print("Register:", resp.status_code, resp.text)
    
    # 2. Login
    resp = session.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    token = resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Check Dashboard (Expected: Start Day)
    print("\n--- State 1: Fresh User ---")
    resp = session.get(f"{BASE_URL}/dashboard/daily-summary", headers=headers)
    print("Dashboard Next Action:", resp.json().get("next_action"))

    # 4. Book Desk (Use ID 2 to avoid conflict)
    print("\n--- Action: Booking Desk ---")
    today = datetime.date.today().strftime("%Y-%m-%d")
    resp = session.post(f"{BASE_URL}/desk-bookings", json={
        "desk_id": 3, 
        "booking_date": today
    }, headers=headers)
    print("Book Desk:", resp.status_code, resp.text)
    
    # 5. Check Dashboard (Expected: Missing Food)
    print("\n--- State 2: Desk Booked ---")
    resp = session.get(f"{BASE_URL}/dashboard/daily-summary", headers=headers)
    print("Dashboard Next Action:", resp.json().get("next_action"))
    
    # 6. Order Food
    print("\n--- Action: Ordering Food ---")
    resp = session.post(f"{BASE_URL}/orders", json={
        "items": [{"item_id": 1, "quantity": 1}]
    }, headers=headers)
    print("Order Food:", resp.status_code, resp.text)
    
    # 7. Check Dashboard (Expected: All Set)
    print("\n--- State 3: Both Done ---")
    resp = session.get(f"{BASE_URL}/dashboard/daily-summary", headers=headers)
    print("Dashboard Next Action:", resp.json().get("next_action"))

if __name__ == "__main__":
    run()
