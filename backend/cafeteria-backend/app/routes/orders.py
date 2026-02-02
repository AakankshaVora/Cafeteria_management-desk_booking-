from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.database import SessionLocal
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.menu_item import MenuItem

orders_bp = Blueprint("orders", __name__, url_prefix="/orders")


# ==============================
# PLACE ORDER (EMPLOYEE)
# ==============================
@orders_bp.route("", methods=["POST"])
@jwt_required()
def place_order():
    claims = get_jwt()
    role = claims.get("role")

    if role != "employee":
        return jsonify({"message": "Only employees can place orders"}), 403

    data = request.get_json()
    if not data or "items" not in data:
        return jsonify({"message": "Order items required"}), 400

    user_id = int(get_jwt_identity())
    items = data["items"]

    db = SessionLocal()
    total_price = 0
    order_items_data = []

    for item in items:
        menu_item = db.query(MenuItem).filter(
            MenuItem.id == item["menu_item_id"]
        ).first()

        if not menu_item:
            db.close()
            return jsonify({"message": "Invalid menu item"}), 400

        quantity = item.get("quantity", 1)
        total_price += menu_item.price * quantity

        order_items_data.append({
            "menu_item": menu_item,
            "quantity": quantity
        })

    order = Order(
        user_id=user_id,
        total_amount=total_price,
        status="pending"
    )

    db.add(order)
    db.commit()
    db.refresh(order)

    for item in order_items_data:
        order_item = OrderItem(
            order_id=order.id,
            menu_item_id=item["menu_item"].id,
            quantity=item["quantity"],
            price=item["menu_item"].price
        )
        db.add(order_item)

    db.commit()
    db.close()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order.id,
        "total_amount": total_price
    }), 201


# ==============================
# VIEW ALL ORDERS (CAFETERIA ADMIN)
# ==============================
@orders_bp.route("", methods=["GET"])
@jwt_required()
def get_all_orders():
    claims = get_jwt()
    if claims.get("role") != "cafeteria_admin":
        return jsonify({"message": "Admin access required"}), 403

    db = SessionLocal()
    orders = db.query(Order).all()

    result = []
    for order in orders:
        result.append({
            "order_id": order.id,
            "user_id": order.user_id,
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at
        })

    db.close()
    return jsonify(result), 200


# ==============================
# UPDATE ORDER STATUS (CAFETERIA ADMIN)
# ==============================
@orders_bp.route("/<int:order_id>/status", methods=["PUT"])
@jwt_required()
def update_order_status(order_id):
    claims = get_jwt()
    if claims.get("role") != "cafeteria_admin":
        return jsonify({"message": "Admin access required"}), 403

    data = request.get_json()
    if not data or "status" not in data:
        return jsonify({"message": "Status required"}), 400

    db = SessionLocal()
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        db.close()
        return jsonify({"message": "Order not found"}), 404

    order.status = data["status"]
    db.commit()
    db.close()

    return jsonify({
        "message": "Order status updated",
        "order_id": order_id,
        "new_status": data["status"]
    }), 200
