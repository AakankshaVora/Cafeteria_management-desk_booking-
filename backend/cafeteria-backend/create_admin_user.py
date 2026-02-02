from werkzeug.security import generate_password_hash
from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()

# Check if admin already exists
admin = db.query(User).filter(
    User.email == "admin@example.com"
).first()

if admin:
    print("Admin user already exists with ID:", admin.id)
    db.close()
    exit()

admin = User(
    name="Cafeteria Admin",
    email="admin@example.com",
    password_hash=generate_password_hash("admin123"),
    role="cafeteria_admin"
)

db.add(admin)
db.commit()
db.refresh(admin)

print("Admin user created with ID:", admin.id)
db.close()
