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
    # Check for total_amount in payload (user requirement: Ensure backend reads exactly this structure)
    payload_total = data.get("total_amount")

    db = SessionLocal()
    total_price = 0
    order_items_data = []

    for item in items:
        # Contract: item_id, quantity, price
        item_id = item.get("item_id")
        if not item_id:
            db.close()
            return jsonify({"message": "item_id is required for each item"}), 400

        menu_item = db.query(MenuItem).filter(MenuItem.id == item_id).first()

        if not menu_item:
            db.close()
            return jsonify({"message": f"Invalid menu item ID: {item_id}"}), 400

        quantity = item.get("quantity", 1)
        total_price += menu_item.price * quantity

        order_items_data.append({
            "menu_item": menu_item,
            "quantity": quantity
        })

    # Optional: Validate payload_total matches total_price if strictness is needed
    # For now, we trust our calculation but satisfied the read requirement.
    
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
    
    # Extract ID and other needed attributes BEFORE closing session to avoid DetachedInstanceError
    new_order_id = order.id
    final_total = order.total_amount
    
    db.close()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": new_order_id,
        "total_amount": final_total
    }), 201


# ==============================
# VIEW MY ORDERS (EMPLOYEE)
# ==============================
@orders_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_orders():
    user_id = int(get_jwt_identity())
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    
    db = SessionLocal()
    query = db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc())
    
    total_orders = query.count()
    orders = query.offset((page - 1) * per_page).limit(per_page).all()
    
    result = []
    for order in orders:
        # Get items for this order
        items_data = []
        for item in order.items: # Relationship must exist in Order model
             items_data.append({
                 "name": item.menu_item.name,
                 "quantity": item.quantity,
                 "price": item.price
             })

        result.append({
            "id": order.id,
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at.strftime("%Y-%m-%d"),
            "items": items_data # List of objects
        })
    db.close()
    
    return jsonify({
        "orders": result,
        "total": total_orders,
        "page": page,
        "per_page": per_page,
        "total_pages": (total_orders + per_page - 1) // per_page
    }), 200



# ==============================
# VIEW ALL ORDERS (CAFETERIA ADMIN)
# ==============================
@orders_bp.route("", methods=["GET"])
@jwt_required()
def get_all_orders():
    claims = get_jwt()
    role = claims.get("role")

    # DEBUG LOGGING
    with open("debug_log.txt", "a") as f:
        f.write(f"GET ORDERS: User role: {role}, Claims: {claims}\n")

    if role != "cafeteria_admin":
        return jsonify({"message": f"Admin access required. Got: {role}"}), 403

    # Pagination & Filtering
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)
    status = request.args.get("status")

    db = SessionLocal()
    query = db.query(Order)

    if status:
        query = query.filter(Order.status == status)

    date_str = request.args.get("date")
    if date_str:
        from sqlalchemy import cast, Date
        query = query.filter(cast(Order.created_at, Date) == date_str)

    # Apply pagination
    total_orders = query.count()
    orders = query.order_by(Order.created_at.desc()).offset((page - 1) * per_page).limit(per_page).all()

    result = []
    for order in orders:
        items_data = []
        for item in order.items:
            items_data.append({
                "name": item.menu_item.name,
                "quantity": item.quantity,
                "price": item.price
            })

        result.append({
            "order_id": order.id,
            "user_id": order.user_id,
            "user_name": order.user.name,
            "status": order.status,
            "total_amount": order.total_amount,
            "created_at": order.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "items": items_data
        })

    db.close()
    
    return jsonify({
        "orders": result,
        "total": total_orders,
        "page": page,
        "per_page": per_page,
        "total_pages": (total_orders + per_page - 1) // per_page
    }), 200


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


# ==============================
# CANCEL ORDER (EMPLOYEE)
# ==============================
@orders_bp.route("/<int:order_id>/cancel", methods=["PUT"])
@jwt_required()
def cancel_order(order_id):
    claims = get_jwt()
    role = claims.get("role")
    user_id = int(get_jwt_identity())

    db = SessionLocal()
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        db.close()
        return jsonify({"message": "Order not found"}), 404

    # Check ownership
    if role != "cafeteria_admin" and order.user_id != user_id:
        db.close()
        return jsonify({"message": "Access denied"}), 403
    
    # Check if cancellable (only pending)
    if order.status != "pending":
        db.close()
        return jsonify({"message": "Cannot cancel processed order"}), 400

    order.status = "cancelled"
    db.commit()
    db.close()

    return jsonify({"message": "Order cancelled successfully"}), 200


# ==============================
# COMPLETE ORDER (CAFETERIA ADMIN)
# ==============================
@orders_bp.route("/<int:order_id>/complete", methods=["PUT"])
@jwt_required()
def complete_order(order_id):
    claims = get_jwt()
    if claims.get("role") != "cafeteria_admin":
        return jsonify({"message": "Admin access required"}), 403

    db = SessionLocal()
    order = db.query(Order).filter(Order.id == order_id).first()

    if not order:
        db.close()
        return jsonify({"message": "Order not found"}), 404

    order.status = "completed"
    db.commit()
    db.close()

    return jsonify({"message": "Order marked as completed"}), 200


# ==============================
# DASHBOARD STATS (CAFETERIA ADMIN)
# ==============================
@orders_bp.route("/stats", methods=["GET"])
@jwt_required()
def get_dashboard_stats():
    claims = get_jwt()
    if claims.get("role") != "cafeteria_admin":
        return jsonify({"message": "Admin access required"}), 403

    from datetime import datetime, date
    from sqlalchemy import func, cast, Date

    db = SessionLocal()
    today = date.today()

    # 1. Total Orders Today
    total_orders_today = db.query(Order).filter(
        cast(Order.created_at, Date) == today
    ).count()

    # 2. Revenue Today (Sum of total_amount for orders made today, exclude cancelled?)
    # Usually we include specific statuses, assuming 'cancelled' don't count.
    revenue_today = db.query(func.sum(Order.total_amount)).filter(
        cast(Order.created_at, Date) == today,
        Order.status != "cancelled"
    ).scalar() or 0

    # 3. Pending Orders (Total currently pending)
    pending_orders = db.query(Order).filter(
        Order.status == "pending"
    ).count()

    # 4. Item Wise Demand (Today)
    # Join OrderItem -> Order, Filter Order date = today, Group By MenuItem
    # We need name, count, total_revenue from items
    item_stats = db.query(
        MenuItem.name,
        func.sum(OrderItem.quantity).label("total_qty"),
        func.sum(OrderItem.price * OrderItem.quantity).label("total_rev")
    ).join(OrderItem, MenuItem.id == OrderItem.menu_item_id)\
     .join(Order, Order.id == OrderItem.order_id)\
     .filter(
         cast(Order.created_at, Date) == today,
         Order.status != "cancelled"
     )\
     .group_by(MenuItem.name)\
     .order_by(func.sum(OrderItem.quantity).desc())\
     .all()

    item_demand = []
    for name, qty, rev in item_stats:
        item_demand.append({
            "name": name,
            "orders": qty,
            "revenue": rev
        })

    db.close()

    return jsonify({
        "orders_today": total_orders_today,
        "revenue_today": revenue_today,
        "pending_orders": pending_orders,
        "item_demand": item_demand
    }), 200
