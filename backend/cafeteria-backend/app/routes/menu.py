from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.database import SessionLocal
from app.models.menu_item import MenuItem

menu_bp = Blueprint("menu", __name__, url_prefix="/menu")


# 🟢 GET ALL MENU ITEMS (ANY LOGGED-IN USER)
@menu_bp.route("", methods=["GET"])
@jwt_required()
def get_menu():
    db = SessionLocal()
    menu_items = db.query(MenuItem).all()
    db.close()

    result = []
    for item in menu_items:
        result.append({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "is_available": item.is_available
        })

    return jsonify(result), 200


# 🔴 ADD MENU ITEM (CAFETERIA ADMIN ONLY)
@menu_bp.route("", methods=["POST"])
@jwt_required()
def add_menu_item():
    claims = get_jwt()
    role = claims.get("role")

    # ROLE CHECK
    if role != "cafeteria_admin":
        return jsonify({"message": "Access denied"}), 403

    data = request.get_json()

    if not data or "name" not in data or "price" not in data:
        return jsonify({"message": "Name and price required"}), 400

    new_item = MenuItem(
        name=data["name"],
        description=data.get("description", ""),
        price=data["price"],
        is_available=True
    )

    db = SessionLocal()
    db.add(new_item)
    db.commit()
    db.close()

    return jsonify({"message": "Menu item added successfully"}), 201
