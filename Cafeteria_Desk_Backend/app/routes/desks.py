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
    start_time_str = request.args.get("start_time")
    end_time_str = request.args.get("end_time")

    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            target_date = datetime.now().date()
    else:
        target_date = datetime.now().date()

    # Get bookings for the target date
    bookings_query = db.query(DeskBooking).filter(
        DeskBooking.booking_date == target_date,
        DeskBooking.status != 'cancelled'
    )
    
    all_bookings = bookings_query.all()
    
    # Create a map of desk_id -> list of bookings
    booking_map = {}
    for b in all_bookings:
        if b.desk_id not in booking_map:
            booking_map[b.desk_id] = []
        booking_map[b.desk_id].append(b)

    result = []
    for desk in desks:
        # Base status from DB (available / maintenance)
        status = desk.status
        booked_by = "-"
        start_time = "-"
        end_time = "-"
        
        # Check availability
        # Only override if the desk is nominally available (not maintenance)
        if status == "available" and desk.id in booking_map:
            # Check for conflict
            is_conflict = False
            relevant_booking = None
            
            for b in booking_map[desk.id]:
                # If times are provided, check for overlap
                if start_time_str and end_time_str:
                     # Overlap: (StartA < EndB) and (EndA > StartB)
                     if b.start_time < end_time_str and b.end_time > start_time_str:
                         is_conflict = True
                         relevant_booking = b
                         break
                else:
                    # No time specified, if ANY booking exists, mark as Booked?
                    # Or maybe "Partially Booked"? 
                    # For now, to be safe and simple: If no time provided, show Booked if any booking exists.
                    is_conflict = True
                    relevant_booking = b
                    break
            
            if is_conflict:
                status = "Booked"
                if relevant_booking:
                    booked_by = relevant_booking.user.name
                    start_time = relevant_booking.start_time
                    end_time = relevant_booking.end_time
            
        result.append({
            "id": desk.id,
            "desk_code": desk.desk_code,
            "location": desk.location,
            "block": desk.block,
            "row": desk.row,
            "col": desk.col,
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
