from werkzeug.security import generate_password_hash
from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()

# Fetch the existing admin user
admin = db.query(User).filter(User.email == "admin@example.com").first()

if admin:
    print(f"Found admin user: {admin.email}")
    # Force update the password
    new_password = "admin123"
    admin.password_hash = generate_password_hash(new_password)
    db.commit()
    print(f"Password for {admin.email} has been reset to '{new_password}'.")
else:
    print("Admin user not found! Creating one...")
    admin = User(
        name="Cafeteria Admin",
        email="admin@example.com",
        password_hash=generate_password_hash("admin123"),
        role="cafeteria_admin"
    )
    db.add(admin)
    db.commit()
    print("Admin user created with ID:", admin.id)

db.close()
