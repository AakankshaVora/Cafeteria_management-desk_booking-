from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt
from app.database import SessionLocal
from app.models.menu_item import MenuItem

menu_bp = Blueprint("menu", __name__, url_prefix="/menu")


# 🟢 GET ALL MENU ITEMS (ANY LOGGED-IN USER)
@menu_bp.route("", methods=["GET"])
@jwt_required()
def get_menu():
    query_param = request.args.get("q")
    
    db = SessionLocal()
    query = db.query(MenuItem)
    
    if query_param:
        query = query.filter(MenuItem.name.ilike(f"%{query_param}%"))
        
    menu_items = query.all()
    db.close()

    result = []
    for item in menu_items:
        result.append({
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "is_available": item.is_available,
            "is_special": item.is_special or False
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
        is_available=data.get("is_available", True)
    )

    db = SessionLocal()
    db.add(new_item)
    db.commit()
    db.close()

    return jsonify({"message": "Menu item added successfully"}), 201


# 🟢 GET SINGLE MENU ITEM
@menu_bp.route("/<int:id>", methods=["GET"])
@jwt_required()
def get_menu_item(id):
    db = SessionLocal()
    item = db.query(MenuItem).filter(MenuItem.id == id).first()
    db.close()

    if not item:
        return jsonify({"message": "Menu item not found"}), 404

    return jsonify({
        "id": item.id,
        "name": item.name,
        "description": item.description,
        "price": item.price,
        "is_available": item.is_available
    }), 200


# 🟠 UPDATE MENU ITEM (CAFETERIA ADMIN ONLY)
@menu_bp.route("/update/<int:id>", methods=["PUT"])
@jwt_required()
def update_menu_item(id):
    claims = get_jwt()
    role = claims.get("role")
    
    # DEBUG LOGGING
    with open("debug_log.txt", "a") as f:
        f.write(f"UPDATE ITEM: User role: {role}, Claims: {claims}\n")

    if role != "cafeteria_admin":
        return jsonify({"message": f"Access denied. Required: cafeteria_admin. Got: {role}"}), 403

    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body required"}), 400

    db = SessionLocal()
    item = db.query(MenuItem).filter(MenuItem.id == id).first()

    if not item:
        db.close()
        return jsonify({"message": "Menu item not found"}), 404

    item.name = data.get("name", item.name)
    item.description = data.get("description", item.description)
    item.price = data.get("price", item.price)
    if "is_available" in data:
        item.is_available = data["is_available"]

    db.commit()
    db.close()

    return jsonify({"message": "Menu item updated successfully"}), 200


# 🔴 DELETE MENU ITEM (CAFETERIA ADMIN ONLY)
@menu_bp.route("/delete/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_menu_item(id):
    claims = get_jwt()
    if claims.get("role") != "cafeteria_admin":
        return jsonify({"message": "Access denied"}), 403

    db = SessionLocal()
    item = db.query(MenuItem).filter(MenuItem.id == id).first()

    if not item:
        db.close()
        return jsonify({"message": "Menu item not found"}), 404

    db.delete(item)
    db.commit()
    db.close()

    return jsonify({"message": "Menu item deleted successfully"}), 200


# 🟡 SET AS TODAY'S SPECIAL (CAFETERIA ADMIN ONLY)
@menu_bp.route("/<int:id>/special", methods=["PUT"])
@jwt_required()
def set_special_dish(id):
    try:
        claims = get_jwt()
        if claims.get("role") != "cafeteria_admin":
            return jsonify({"message": "Access denied"}), 403

        db = SessionLocal()
        
        # Verify item exists
        item = db.query(MenuItem).filter(MenuItem.id == id).first()
        if not item:
            db.close()
            return jsonify({"message": "Menu item not found"}), 404

        # Unset 'is_special' for ALL items (Assume only one special at a time)
        # Handle NULLs by just setting all to False? Or filtering?
        # Using synchronize_session=False for performance and avoiding session mismatch
        db.query(MenuItem).filter(MenuItem.is_special == True).update({"is_special": False}, synchronize_session=False)
        
        # Set this item as special
        item.is_special = True
        
        item_name = item.name # Capture name before commit/close
        db.commit()
        db.close()

        return jsonify({"message": f"'{item_name}' is now Today's Special"}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": f"Server Error: {str(e)}"}), 500
