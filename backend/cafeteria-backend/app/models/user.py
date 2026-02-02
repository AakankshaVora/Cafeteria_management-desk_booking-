from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    email = Column(String(120), unique=True, index=True)
    password_hash = Column(String(255))
    role = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    orders = relationship("Order", back_populates="user", cascade="all, delete")
    desk_bookings = relationship("DeskBooking", back_populates="user", cascade="all, delete")
    reviews = relationship("Review", back_populates="user", cascade="all, delete")

