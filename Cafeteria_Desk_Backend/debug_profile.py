import requests
import datetime

BASE_URL = "http://127.0.0.1:5000"

def run():
    session = requests.Session()
    email = f"profile_test_{datetime.datetime.now().timestamp()}@test.com"
    password = "password123"

    # 1. Register
    print(f"Registering {email}...")
    resp = session.post(f"{BASE_URL}/auth/register", json={
        "name": "Original Name",
        "email": email,
        "password": password,
        "role": "employee"
    })
    print("Register:", resp.status_code)
    
    # 2. Login
    resp = session.post(f"{BASE_URL}/auth/login", json={"email": email, "password": password})
    token = resp.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Get Profile
    print("\n--- GET Profile ---")
    resp = session.get(f"{BASE_URL}/auth/profile", headers=headers)
    print("Status:", resp.status_code)
    print("Data:", resp.json())
    
    if resp.status_code != 200:
        print("FAIL: Could not get profile")
        return

    # 4. Update Profile
    print("\n--- UPDATE Profile ---")
    new_name = "Dynamic Name Change"
    resp = session.put(f"{BASE_URL}/auth/profile", json={"name": new_name}, headers=headers)
    print("Status:", resp.status_code)
    print("Data:", resp.json())

    # 5. Verify Update
    print("\n--- VERIFY Update ---")
    resp = session.get(f"{BASE_URL}/auth/profile", headers=headers)
    print("Data:", resp.json())
    
    if resp.json().get("name") == new_name:
        print("SUCCESS: Profile updated dynamically!")
    else:
        print("FAIL: Profile name mismatch")

if __name__ == "__main__":
    run()
