from werkzeug.security import generate_password_hash
from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()

# Check if desk admin already exists
user = db.query(User).filter(User.email == "deskadmin@example.com").first()

if user:
    print("Desk Admin already exists with ID:", user.id)
else:
    user = User(
        name="Desk Admin",
        email="deskadmin@example.com",
        password_hash=generate_password_hash("deskadmin123"),
        role="desk_admin"
    )
    db.add(user)
    db.commit()
    print("Desk Admin created with ID:", user.id)

db.close()
