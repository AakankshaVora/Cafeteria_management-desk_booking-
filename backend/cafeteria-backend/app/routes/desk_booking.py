from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt, get_jwt_identity
from datetime import datetime

from app.database import SessionLocal
from app.models.desk_booking import DeskBooking
from app.models.desk import Desk

desk_booking_bp = Blueprint(
    "desk_booking",
    __name__,
    url_prefix="/desk-bookings"
)


# 🟢 BOOK A DESK (EMPLOYEE ONLY)
@desk_booking_bp.route("", methods=["POST"])
@jwt_required()
def book_desk():
    claims = get_jwt()
    role = claims.get("role")

    if role != "employee":
        return jsonify({"message": "Only employees can book desks"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body required"}), 400

    desk_id = data.get("desk_id")
    booking_date = data.get("booking_date")

    if not desk_id or not booking_date:
        return jsonify({"message": "desk_id and booking_date required"}), 400

    booking_date = datetime.strptime(booking_date, "%Y-%m-%d").date()
    user_id = int(get_jwt_identity())

    db = SessionLocal()

    desk = db.query(Desk).filter(Desk.id == desk_id).first()
    if not desk:
        db.close()
        return jsonify({"message": "Desk not found"}), 404

    booking = DeskBooking(
        user_id=user_id,
        desk_id=desk_id,
        booking_date=booking_date,
        status="booked"
    )

    db.add(booking)
    db.commit()
    db.refresh(booking)
    db.close()

    return jsonify({
        "message": "Desk booked successfully",
        "booking_id": booking.id
    }), 201
