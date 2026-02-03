from app.app import create_app
from app.database import SessionLocal
from app.models.user import User
from app.models.menu_item import MenuItem
from app.models.desk import Desk
from werkzeug.security import generate_password_hash

app = create_app()

def seed():
    with app.app_context():
        db = SessionLocal()
        
        # Standard Users Configuration
        users_data = [
            {
                "email": "admin@example.com",
                "password": "admin123", # Standard Admin Password
                "role": "cafeteria_admin",
                "name": "Cafeteria Admin"
            },
            {
                "email": "deskadmin@example.com",
                "password": "deskadmin123", # Standard Desk Admin Password
                "role": "desk_admin",
                "name": "Desk Admin"
            },
            {
                "email": "employee@example.com",
                "password": "employee123", # Standard Employee Password
                "role": "employee",
                "name": "John Doe"
            }
        ]

        print("Seeding/Updating Users...")
        for user_info in users_data:
            user = db.query(User).filter(User.email == user_info["email"]).first()
            if user:
                print(f"Updating existing user: {user_info['email']}")
                user.password_hash = generate_password_hash(user_info["password"])
                user.role = user_info["role"]
                user.name = user_info["name"]
            else:
                print(f"Creating new user: {user_info['email']}")
                user = User(
                    email=user_info["email"],
                    password_hash=generate_password_hash(user_info["password"]),
                    role=user_info["role"],
                    name=user_info["name"]
                )
                db.add(user)
        
        # Menu Items (Only add if empty to avoid duplicates on re-seed, or just leave as is since we focused on users)
        if not db.query(MenuItem).first():
            print("Seeding Menu Items...")
            items = [
                MenuItem(name="Veg Sandwich", price=50, description="Fresh veggies", is_available=True),
                MenuItem(name="Chicken Burger", price=120, description="Juicy patty", is_available=True),
                MenuItem(name="Cold Coffee", price=60, description="Chilled", is_available=True)
            ]
            db.add_all(items)
        
        # Desks (Only add if empty)
        if not db.query(Desk).first():
            print("Seeding Desks...")
            desks = [
                Desk(desk_code="D1", location="Floor 1", status="available"),
                Desk(desk_code="D2", location="Floor 1", status="available"),
                Desk(desk_code="D3", location="Floor 2", status="available")
            ]
            db.add_all(desks)
        
        db.commit()
        db.close()
        print("Database seeded and credentials updated!")

if __name__ == "__main__":
    seed()
