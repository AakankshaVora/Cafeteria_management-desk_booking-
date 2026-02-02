from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

from app.database import SessionLocal
from app.models.user import User

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    if not data or "email" not in data or "password" not in data:
        return jsonify({"message": "Email and password required"}), 400

    email = data["email"]
    password = data["password"]

    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()

    if not user:
        return jsonify({"message": "Invalid email or password"}), 401

    if not check_password_hash(user.password_hash, password):
        return jsonify({"message": "Invalid email or password"}), 401

    # 🔐 CRITICAL FIX: identity MUST be string
    access_token = create_access_token(
        identity=str(user.id),
        additional_claims={"role": user.role}
    )

    return jsonify({
        "message": "Login successful",
        "access_token": access_token,
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role
        }
    }), 200
