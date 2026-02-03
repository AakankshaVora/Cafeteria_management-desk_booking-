from datetime import datetime
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from app.database import SessionLocal
from app.models.desk import Desk
from app.models.desk_booking import DeskBooking

desks_bp = Blueprint("desks", __name__, url_prefix="/desks")


# ==============================
# CREATE DESK (ADMIN)
# ==============================
@desks_bp.route("", methods=["POST"])
@jwt_required()
def create_desk():
    claims = get_jwt()
    role = claims.get("role")

    if role not in ["cafeteria_admin", "desk_admin"]:
        return jsonify({"message": "Admin access required"}), 403

    data = request.get_json()
    if not data or "desk_code" not in data or "location" not in data:
        return jsonify({"message": "desk_code and location required"}), 400

    db = SessionLocal()

    desk = Desk(
        desk_code=data["desk_code"],
        location=data["location"],
        status="available"
    )

    db.add(desk)
    db.commit()
    db.close()

    return jsonify({"message": "Desk created successfully"}), 201


# ==============================
# VIEW ALL DESKS (ANY LOGGED USER)
# ==============================
@desks_bp.route("", methods=["GET"])
@jwt_required()
def get_desks():
    db = SessionLocal()
    desks = db.query(Desk).all()
    
    # Get date from query param, default to today
    date_str = request.args.get("date")
    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            target_date = datetime.now().date()
    else:
        target_date = datetime.now().date()

    # Get bookings for the target date
    bookings_on_date = db.query(DeskBooking).filter(
        DeskBooking.booking_date == target_date,
        DeskBooking.status != 'cancelled'
    ).all()
    
    # Create a map of desk_id -> booking
    booking_map = {b.desk_id: b for b in bookings_on_date}

    result = []
    for desk in desks:
        # Base status from DB (available / maintenance)
        status = desk.status
        booked_by = "-"
        start_time = "-"
        end_time = "-"
        
        # Override if booked on target date
        # Only override if the desk is nominally available (not maintenance)
        if status == "available" and desk.id in booking_map:
            status = "Booked"
            booking = booking_map[desk.id]
            booked_by = booking.user.name
            start_time = booking.start_time
            end_time = booking.end_time
            
        result.append({
            "id": desk.id,
            "desk_code": desk.desk_code,
            "location": desk.location,
            "status": status,
            "booked_by": booked_by,
            "date": target_date.strftime("%Y-%m-%d"),
            "start_time": start_time,
            "end_time": end_time
        })

    db.close()
    return jsonify(result), 200


# ==============================
# GET DESK STATS (ADMIN)
# ==============================
@desks_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_desk_stats():
    # Optional: Check role if these stats are sensitive, 
    # but likely any employee can see availability counts.
    # If restricted:
    # claims = get_jwt()
    # if claims.get("role") not in ["cafeteria_admin", "desk_admin"]:
    #     return jsonify({"message": "Access denied"}), 403

    db = SessionLocal()
    total_desks = db.query(Desk).count()
    
    today = datetime.now().date()
    # Count accepted bookings for today
    booked_today = db.query(DeskBooking).filter(
        DeskBooking.booking_date == today,
        DeskBooking.status != 'cancelled'
    ).count()

    # Available = Total - Booked
    # (assuming no maintenance status for now, or maintenance is included in total but not booked)
    # If we want available to be "bookable", we should subtract maintenance too if we had it.
    # Current desk model has status='available' by default.
    available_today = total_desks - booked_today
    if available_today < 0: available_today = 0 # Safety

    db.close()

    return jsonify({
        "total_desks": total_desks,
        "booked_today": booked_today,
        "available_today": available_today
    }), 200


# ==============================
# UPDATE DESK STATUS (ADMIN)
# ==============================
@desks_bp.route("/<int:desk_id>/status", methods=["PUT"])
@jwt_required()
def update_desk_status(desk_id):
    claims = get_jwt()
    if claims.get("role") not in ["cafeteria_admin", "desk_admin"]:
        return jsonify({"message": "Admin access required"}), 403

    data = request.get_json()
    new_status = data.get("status")

    if not new_status or new_status not in ["available", "maintenance"]:
        return jsonify({"message": "Invalid status. Use 'available' or 'maintenance'"}), 400

    db = SessionLocal()
    desk = db.query(Desk).filter(Desk.id == desk_id).first()

    if not desk:
        db.close()
        return jsonify({"message": "Desk not found"}), 404

    # Update status
    desk.status = new_status
    db.commit()
    db.close()

    return jsonify({"message": f"Desk status updated to {new_status}"}), 200
