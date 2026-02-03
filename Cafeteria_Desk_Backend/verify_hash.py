from app.app import create_app
from werkzeug.security import generate_password_hash, check_password_hash
from app.database import SessionLocal
from app.models.user import User

app = create_app()

with app.app_context():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "employee@example.com").first()
    
    if user:
        print(f"User found: {user.email}")
        print(f"Stored Hash: {user.password_hash}")
        
        test_password = "password"
        is_match = check_password_hash(user.password_hash, test_password)
        print(f"Matches '{test_password}': {is_match}")
        
        new_hash = generate_password_hash(test_password)
        print(f"New Hash for '{test_password}': {new_hash}")
        
        is_new_match = check_password_hash(new_hash, test_password)
        print(f"New Hash matches: {is_new_match}")
    else:
        print("User not found")
    
    db.close()
