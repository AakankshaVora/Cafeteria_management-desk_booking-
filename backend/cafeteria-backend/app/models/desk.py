from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Desk(Base):
    __tablename__ = "desks"

    id = Column(Integer, primary_key=True)
    desk_code = Column(String, unique=True, nullable=False)
    location = Column(String, nullable=False)
    status = Column(String, default="available")

    # ✅ relationship with DeskBooking
    desk_bookings = relationship(
        "DeskBooking",
        back_populates="desk",
        cascade="all, delete-orphan"
    )
