from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime

from app.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    rating = Column(Integer, nullable=False)
    feedback = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)

    # ✅ REQUIRED relationship
    user = relationship("User", back_populates="reviews")
