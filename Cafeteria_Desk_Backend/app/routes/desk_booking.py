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
    start_time = data.get("start_time", "09:00") # Default if missing
    end_time = data.get("end_time", "18:00")     # Default if missing

    if not desk_id or not booking_date:
        return jsonify({"message": "desk_id and booking_date required"}), 400

    booking_date = datetime.strptime(booking_date, "%Y-%m-%d").date()
    user_id = int(get_jwt_identity())

    db = SessionLocal()


    desk = db.query(Desk).filter(Desk.id == desk_id).first()
    if not desk:
        db.close()
        return jsonify({"message": "Desk not found"}), 404

    if desk.status != "available":
        db.close()
        return jsonify({"message": f"Desk is currently {desk.status} and cannot be booked"}), 400

    # CHECK AVAILABILITY
    existing_booking = db.query(DeskBooking).filter(
        DeskBooking.desk_id == desk_id,
        DeskBooking.booking_date == booking_date,
        DeskBooking.status != 'cancelled'
    ).first()

    if existing_booking:
        db.close()
        return jsonify({"message": "Desk already booked for this date"}), 400

    booking = DeskBooking(
        user_id=user_id,
        desk_id=desk_id,
        booking_date=booking_date,
        start_time=start_time,
        end_time=end_time,
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


# 🟢 GET MY BOOKINGS (EMPLOYEE ONLY)
@desk_booking_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_bookings():
    claims = get_jwt()
    if claims.get("role") != "employee":
        return jsonify({"message": "Access denied"}), 403

    user_id = int(get_jwt_identity())
    db = SessionLocal()
    bookings = db.query(DeskBooking).filter(
        DeskBooking.user_id == user_id
    ).all()

    result = []
    for booking in bookings:
        result.append({
            "id": booking.id,
            "desk_id": booking.desk_id,
            "location": booking.desk.location if booking.desk else "N/A", # Added location
            "booking_date": booking.booking_date.strftime("%Y-%m-%d"),
            "start_time": booking.start_time or "09:00", # Use DB val or default
            "end_time": booking.end_time or "18:00",     # Use DB val or default
            "status": booking.status
        })
    db.close()

    return jsonify(result), 200


# 🔵 GET ALL BOOKINGS (ADMIN ONLY)
@desk_booking_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_bookings():
    claims = get_jwt()
    if claims.get("role") not in ["cafeteria_admin", "desk_admin"]:
        return jsonify({"message": "Admin access required"}), 403

    db = SessionLocal()
    # List all bookings, ordered by date desc
    bookings = db.query(DeskBooking).order_by(DeskBooking.booking_date.desc()).all()

    result = []
    for booking in bookings:
        result.append({
            "id": booking.id,
            "desk_id": booking.desk.desk_code, # Use desk_code for display
            "user_name": booking.user.name,
            "booking_date": booking.booking_date.strftime("%Y-%m-%d"),
            "start_time": booking.start_time or "09:00",
            "end_time": booking.end_time or "18:00",
            "status": booking.status
        })
    db.close()

    return jsonify(result), 200


# 🔴 CANCEL BOOKING (EMPLOYEE/ADMIN)
@desk_booking_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def cancel_booking(id):
    claims = get_jwt()
    role = claims.get("role")
    user_id = int(get_jwt_identity())

    db = SessionLocal()
    booking = db.query(DeskBooking).filter(DeskBooking.id == id).first()

    if not booking:
        db.close()
        return jsonify({"message": "Booking not found"}), 404

    # Allow cancellation if user owns it OR is admin
    if role != "cafeteria_admin" and booking.user_id != user_id:
        db.close()
        return jsonify({"message": "Access denied"}), 403

    db.delete(booking)
    db.commit()
    db.close()

    return jsonify({"message": "Booking cancelled successfully"}), 200


# 🟠 CANCEL BOOKING (UPDATE STATUS)
@desk_booking_bp.route("/<int:id>/cancel", methods=["PUT"])
@jwt_required()
def cancel_booking_status(id):
    claims = get_jwt()
    role = claims.get("role")
    user_id = int(get_jwt_identity())

    db = SessionLocal()
    booking = db.query(DeskBooking).filter(DeskBooking.id == id).first()

    if not booking:
        db.close()
        return jsonify({"message": "Booking not found"}), 404

    # Allow cancellation if user owns it OR is admin
    if role != "cafeteria_admin" and booking.user_id != user_id:
        db.close()
        return jsonify({"message": "Access denied"}), 403

    booking.status = "cancelled"
    db.commit()
    db.close()

    return jsonify({"message": "Booking cancelled successfully"}), 200
