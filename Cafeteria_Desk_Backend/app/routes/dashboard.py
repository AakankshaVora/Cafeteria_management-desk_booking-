from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required

from app.database import SessionLocal
from app.models.menu_item import MenuItem
from app.models.desk import Desk

dashboard_bp = Blueprint("dashboard", __name__, url_prefix="/dashboard")


@dashboard_bp.route("/daily-summary", methods=["GET"])
@jwt_required()
def get_daily_summary():
    from flask_jwt_extended import get_jwt_identity
    from datetime import date
    from app.models.desk_booking import DeskBooking
    from app.models.order import Order
    from app.models.menu_item import MenuItem
    from sqlalchemy import func
    import random

    user_id = int(get_jwt_identity())
    db = SessionLocal()
    today = date.today()

    # 1. Determine "My Next Action"
    # Logic:
    # - Desk: NO, Food: NO  -> Start Day (Book Desk)
    # - Desk: YES, Food: NO -> Missing Food (Order Food)
    # - Desk: NO, Food: YES -> Missing Desk (Book Desk)
    # - Desk: YES, Food: YES -> All Set (View Details)
    
    # Check Desk
    booking = db.query(DeskBooking).filter(
        DeskBooking.user_id == user_id,
        DeskBooking.booking_date == today,
        DeskBooking.status != 'cancelled'
    ).first()
    
    # Check Orders (Any order for today, not just pending)
    # Cast created_at to date
    has_order_today = db.query(Order).filter(
        Order.user_id == user_id,
        func.date(Order.created_at) == today
    ).first()
    
    # Check Pending Orders (for the nudge count)
    pending_orders_count = db.query(Order).filter(
        Order.user_id == user_id,
        Order.status == 'pending'
    ).count()

    next_action = {}
    
    if booking and has_order_today:
        next_action = {
            "type": "all_set",
            "title": "You are all set for today! ✅",
            "subtitle": f"Desk {booking.desk.desk_code} booked & Lunch ordered.",
            "action_text": "View Schedule",
            "link": "/employee/my-orders-bookings"
        }
    elif booking and not has_order_today:
        next_action = {
            "type": "missing_food",
            "title": f"Desk {booking.desk.desk_code} is ready 🖥️",
            "subtitle": "But you haven't ordered lunch yet.",
            "action_text": "Order Food",
            "link": "/employee/order-food"
        }
    elif not booking and has_order_today:
        next_action = {
            "type": "missing_desk",
            "title": "Lunch is ordered 🍔",
            "subtitle": "But you forgot to book a desk!",
            "action_text": "Book Desk",
            "link": "/employee/book-desk"
        }
    else:
        # Neither
        next_action = {
            "type": "start_day",
            "title": "Plan your day 🚀",
            "subtitle": "You haven’t booked a desk or ordered food.",
            "action_text": "Book Desk",
            "link": "/employee/book-desk"
        }
    
    # If there are pending orders, maybe we override or show as secondary?
    # The requirement says "If order pending -> '1 food order is still pending'".
    # Let's say if desk IS booked, but order is pending, show order?
    # Or maybe prioritize Pending Order if it exists?
    # Let's prioritize "No Desk" (Urgent) -> "Order Pending" (Info) -> "Desk Booked" (Info)
    # Actually, "No Desk" is only urgent if they want to come in.
    
    # Let's try to fit the specific requested examples logic.
    # If no desk booked -> Show No Desk message
    # If desk booked -> Show Desk message
    # The user example lists them as distinct possibilities.
    # I'll return specific "pending_orders" count separately so frontend can also show it,
    # OR I'll make the "next_action" logic handle the priority.
    # Let's return a "states" object.
    
    # Modified approach: Return all necessary info, let frontend decide or return a calculated 'primary card'.
    
    # Let's stick to returning a decided 'smart_card' payload.
    # Current logic: If Not Booked -> Prompt. If Booked -> Show.
    # We will pass 'pending_orders_count' too.
    
    
    # 2. Special Dish
    # Pick the item marked as 'is_special'. If multiple, take first. If none, pick random.
    special_item = db.query(MenuItem).filter(MenuItem.is_special == True).first()
    
    if not special_item:
        # Fallback to random logic if none set
        count = db.query(MenuItem).count()
        if count > 0:
            idx = random.randint(0, count - 1)
            special_item = db.query(MenuItem).offset(idx).first()

    special_dish = None
    if special_item:
        special_dish = {
            "name": special_item.name,
            "price": special_item.price,
            "category": "Main Course", # Hardcode or add to model if strictly needed, but UI seems fine without dynamic cat
            "rating": 4.8 
        }

    db.close()
    
    return jsonify({
        "next_action": next_action,
        "pending_orders_count": pending_orders_count,
        "special_dish": special_dish
    }), 200


@dashboard_bp.route("/admin-stats", methods=["GET"])
@jwt_required()
def get_admin_dashboard_stats():
    from flask import request
    from flask_jwt_extended import get_jwt
    from datetime import date, datetime
    from sqlalchemy import func, cast, Date, desc
    from app.models.order import Order
    from app.models.order_item import OrderItem
    from app.models.menu_item import MenuItem

    claims = get_jwt()
    if claims.get("role") != "cafeteria_admin":
        return jsonify({"message": "Admin access required"}), 403

    db = SessionLocal()
    
    # Date Filter (Default: Today)
    date_str = request.args.get("date")
    target_date = date.today()
    if date_str:
        try:
            target_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            pass # Fallback to today

    # 1. Basic Counts (For the Widgets)
    # Total Orders
    total_orders = db.query(Order).filter(
        cast(Order.created_at, Date) == target_date
    ).count()

    # Total Revenue (Only completed or all? Usually all non-cancelled)
    revenue = db.query(func.sum(Order.total_amount)).filter(
        cast(Order.created_at, Date) == target_date,
        Order.status != 'cancelled'
    ).scalar() or 0

    # Completed Orders
    completed_orders = db.query(Order).filter(
        cast(Order.created_at, Date) == target_date,
        Order.status == 'completed'
    ).count()

    # Cancelled Orders
    cancelled_orders = db.query(Order).filter(
        cast(Order.created_at, Date) == target_date,
        Order.status == 'cancelled'
    ).count()

    # Avg Order Value
    avg_order_value = 0
    if (total_orders - cancelled_orders) > 0:
        avg_order_value = revenue / (total_orders - cancelled_orders)

    # 3. Top Selling Items
    # Join OrderItem -> Order (to filter by date) -> MenuItem (to get name)
    top_items_query = db.query(
        MenuItem.name,
        func.sum(OrderItem.quantity).label('total_qty'),
        func.sum(OrderItem.price * OrderItem.quantity).label('total_rev')
    ).join(Order, Order.id == OrderItem.order_id)\
     .join(MenuItem, MenuItem.id == OrderItem.menu_item_id)\
     .filter(
         cast(Order.created_at, Date) == target_date,
         Order.status != 'cancelled'
     ).group_by(MenuItem.name)\
     .order_by(desc('total_qty'))\
     .limit(5).all()

    top_items = []
    total_items_sold = sum([item.total_qty for item in top_items_query])
    
    for name, qty, rev in top_items_query:
        pct = 0
        if total_items_sold > 0:
            pct = round((qty / total_items_sold) * 100, 1)
        
        top_items.append({
            "name": name,
            "qty": qty,
            "revenue": f"{rev:,.0f}",
            "percentage": f"{pct}%"
        })

    db.close()

    return jsonify({
        "widgets": {
            "total_orders": total_orders,
            "revenue": f"{revenue:,.0f}", # Format with commas
            "completed": completed_orders,
            "cancelled": cancelled_orders,
            "avg_value": f"{avg_order_value:,.0f}"
        },
        "top_items": top_items
    }), 200
