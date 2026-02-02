from flask import Flask
from flask_jwt_extended import JWTManager
from flask_swagger_ui import get_swaggerui_blueprint

from app.database import Base, engine
from app.config import SECRET_KEY

# 📦 MODELS (IMPORTANT: ensures tables & relationships load)
from app.models.user import User
from app.models.menu_item import MenuItem
from app.models.desk import Desk
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.desk_booking import DeskBooking
from app.models.review import Review

# 🌐 ROUTES
from app.routes.auth import auth_bp
from app.routes.protected import protected_bp
from app.routes.menu import menu_bp
from app.routes.orders import orders_bp
from app.routes.desks import desks_bp
from app.routes.desk_booking import desk_booking_bp


def create_app():
    app = Flask(__name__)

    # 🔐 JWT CONFIG
    app.config["JWT_SECRET_KEY"] = SECRET_KEY
    jwt = JWTManager(app)

    # 🗄️ CREATE DATABASE TABLES
    Base.metadata.create_all(bind=engine)

    # 📌 REGISTER BLUEPRINTS
    app.register_blueprint(auth_bp)
    app.register_blueprint(protected_bp)
    app.register_blueprint(menu_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(desks_bp)
    app.register_blueprint(desk_booking_bp)

    # 📘 SWAGGER CONFIG
    SWAGGER_URL = "/docs"
    API_URL = "/static/swagger.json"

    swaggerui_blueprint = get_swaggerui_blueprint(
        SWAGGER_URL,
        API_URL,
        config={"app_name": "Cafeteria Backend API"}
    )

    app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

    # 🏠 HEALTH CHECK
    @app.route("/")
    def home():
        return {"message": "Cafeteria Backend Running"}

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
