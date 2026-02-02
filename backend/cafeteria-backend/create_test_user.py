from werkzeug.security import generate_password_hash

#  IMPORTANT: import ALL models so relationships resolve
from app.models.user import User
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.desk_booking import DeskBooking
from app.models.review import Review
from app.models.menu_item import MenuItem
from app.models.desk import Desk

from app.database import SessionLocal


def create_user():
    db = SessionLocal()

    user = User(
        name="Test User",
        email="test@example.com",
        password_hash=generate_password_hash("password123"),
        role="employee"
    )

    db.add(user)
    db.commit()

    print(" User created with ID:", user.id)

    db.close()


if __name__ == "__main__":
    create_user()
