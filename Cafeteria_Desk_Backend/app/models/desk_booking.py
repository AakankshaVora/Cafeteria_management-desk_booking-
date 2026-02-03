from sqlalchemy import Column, Integer, Date, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class DeskBooking(Base):
    __tablename__ = "desk_bookings"

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    desk_id = Column(Integer, ForeignKey("desks.id"), nullable=False)
    booking_date = Column(Date, nullable=False)
    start_time = Column(String, nullable=True) # e.g. "09:00"
    end_time = Column(String, nullable=True)   # e.g. "18:00"
    status = Column(String, default="booked")
    created_at = Column(DateTime, default=datetime.utcnow)

    # ✅ relationships (VERY IMPORTANT)
    user = relationship("User", back_populates="desk_bookings")
    desk = relationship("Desk", back_populates="desk_bookings")
