from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt

from app.database import SessionLocal
from app.models.desk import Desk

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

    result = []
    for desk in desks:
        result.append({
            "id": desk.id,
            "desk_code": desk.desk_code,
            "location": desk.location,
            "status": desk.status
        })

    db.close()
    return jsonify(result), 200
