from werkzeug.security import generate_password_hash
from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()

# Reset Employee
employee = db.query(User).filter(User.email == "employee@example.com").first()
if employee:
    employee.password_hash = generate_password_hash("employee123")
    print("Reset employee password")
else:
    print("Employee not found")

# Reset Admin
admin = db.query(User).filter(User.email == "admin@example.com").first()
if admin:
    admin.password_hash = generate_password_hash("admin123")
    print("Reset admin password")
else:
    print("Admin not found")

# Reset Desk Admin
desk_admin = db.query(User).filter(User.email == "deskadmin@example.com").first()
if desk_admin:
    desk_admin.password_hash = generate_password_hash("deskadmin123")
    print("Reset desk admin password")
else:
    print("Desk Admin not found")

db.commit()
db.close()
