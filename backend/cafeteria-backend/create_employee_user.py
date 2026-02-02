from werkzeug.security import generate_password_hash
from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()

employee = User(
    name="Employee User",
    email="employee@example.com",
    password_hash=generate_password_hash("employee123"),
    role="employee"
)

db.add(employee)
db.commit()
db.refresh(employee)

print("Employee user created with ID:", employee.id)

db.close()
