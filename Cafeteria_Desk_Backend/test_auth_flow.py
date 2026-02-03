import requests

BASE_URL = "http://127.0.0.1:5000"

def test_flow():
    # 1. Login
    print("Attempting login...")
    login_payload = {
        "email": "employee@example.com",
        "password": "password"
    }
    
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        print(f"Login Status: {resp.status_code}")
        if resp.status_code != 200:
            print("Login failed!", resp.text)
            return
        
        data = resp.json()
        token = data.get("access_token")
        print(f"Token received: {token[:20]}...")
        
        # 2. Access Protected Route
        print("\nAttempting to access /dashboard/daily-summary...")
        headers = {
            "Authorization": f"Bearer {token}"
        }
        resp = requests.get(f"{BASE_URL}/dashboard/daily-summary", headers=headers)
        print(f"Dashboard Status: {resp.status_code}")
        print("Response:", resp.text)
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_flow()
