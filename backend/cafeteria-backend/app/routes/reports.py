from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from sqlalchemy import func
from datetime import date

from app.database import SessionLocal
from app.models.order import Order
from app.models.desk_booking import DeskBooking

reports_bp = Blueprint(
    "reports",
    __name__,
    url_prefix="/reports"
)

# ======================================
# ADMIN ROLE CHECK
# ======================================
def admin_required():
    claims = get_jwt()
    role = claims.get("role")
    return role in ["cafeteria_admin", "desk_admin"]


# ======================================
# REPORT 1: ORDER SUMMARY
# ======================================
@reports_bp.route("/orders", methods=["GET"])
@jwt_required()
def order_report():
    if not admin_required():
        return jsonify({"message": "Admin access required"}), 403

    db = SessionLocal()

    total_orders = db.query(func.count(Order.id)).scalar()
    pending_orders = db.query(Order).filter(Order.status == "pending").count()
    completed_orders = db.query(Order).filter(Order.status == "completed").count()

    db.close()

    return jsonify({
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "completed_orders": completed_orders
    }), 200


# ======================================
# REPORT 2: REVENUE REPORT
# ======================================
@reports_bp.route("/revenue", methods=["GET"])
@jwt_required()
def revenue_report():
    if not admin_required():
        return jsonify({"message": "Admin access required"}), 403

    db = SessionLocal()

    total_revenue = db.query(
        func.coalesce(func.sum(Order.total_amount), 0)
    ).scalar()

    today_revenue = db.query(
        func.coalesce(func.sum(Order.total_amount), 0)
    ).filter(
        func.date(Order.created_at) == date.today()
    ).scalar()

    db.close()

    return jsonify({
        "total_revenue": float(total_revenue),
        "today_revenue": float(today_revenue)
    }), 200


# ======================================
# REPORT 3: DESK BOOKING REPORT
# ======================================
@reports_bp.route("/desk-bookings", methods=["GET"])
@jwt_required()
def desk_booking_report():
    if not admin_required():
        return jsonify({"message": "Admin access required"}), 403

    db = SessionLocal()

    total_bookings = db.query(func.count(DeskBooking.id)).scalar()
    booked = db.query(DeskBooking).filter(
        DeskBooking.status == "booked"
    ).count()
    approved = db.query(DeskBooking).filter(
        DeskBooking.status == "approved"
    ).count()
    cancelled = db.query(DeskBooking).filter(
        DeskBooking.status == "cancelled"
    ).count()

    db.close()

    return jsonify({
        "total_bookings": total_bookings,
        "booked": booked,
        "approved": approved,
        "cancelled": cancelled
    }), 200
