from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required

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


@auth_bp.route("/logout", methods=["POST"])
def logout():
    # Since we use stateless JWTs without blocklist, client just discards token
    return jsonify({"message": "Logout successful"}), 200


# ==============================
# FORGOT PASSWORD (PUBLIC)
# ==============================
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    if not data or "email" not in data:
        return jsonify({"message": "Email is required"}), 400

    email = data["email"]
    db = SessionLocal()
    user = db.query(User).filter(User.email == email).first()
    db.close()

    if not user:
        # Security: Don't reveal if user exists or not, but for dev we might allow it.
        # Standard: return "If this email exists, a link has been sent."
        # For this dev env, we return a success but maybe a mock token?
        return jsonify({"message": "If your email is registered, you will receive a reset link."}), 200

    # Mock Token Generation (In real app, use timed serializer or DB token)
    # For now, we will return a simple token to the frontend to allow the flow to proceed 
    # since we don't have email. Or better, we just return success and the frontend redirects
    # to the Reset Password page where the user enters "email" and "new password".
    # Without email, users can't get the link. 
    # Let's assume the user "clicked the link" and has arrived at /reset-password.
    # The simplest "working" version without email service:
    # 1. User enters Email -> Backend says OK.
    # 2. Frontend says "Check your email (simulated)" -> User goes to Reset Page manually or via a dev link?
    # Let's make the API return a "demo_token" for dev convenience so we can verify the flow.
    
    demo_token = f"reset-{user.id}-demo"
    return jsonify({
        "message": "Reset link sent (simulated)",
        "token": demo_token 
    }), 200


# ==============================
# RESET PASSWORD (PUBLIC)
# ==============================
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    from werkzeug.security import generate_password_hash
    
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")
    # specific flow: strictly verify token or email?
    # The /forgot-password gave a token `reset-{uid}-demo`.
    # We can parse that back.
    
    if not token or not new_password:
        return jsonify({"message": "Token and new password required"}), 400
        
    # Validate token format
    try:
        parts = token.split("-")
        if len(parts) != 3 or parts[0] != "reset" or parts[2] != "demo":
            return jsonify({"message": "Invalid token"}), 400
        user_id = int(parts[1])
    except:
        return jsonify({"message": "Invalid token format"}), 400

    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        db.close()
        return jsonify({"message": "User not found"}), 404

    # Update password
    user.password_hash = generate_password_hash(new_password)
    db.commit()
    db.close()

    return jsonify({"message": "Password reset successfully. Please login."}), 200


# ==============================
# REGISTER (PUBLIC)
# ==============================
@auth_bp.route("/register", methods=["POST"])
def register():
    from werkzeug.security import generate_password_hash
    
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body required"}), 400
        
    required_fields = ["name", "email", "password", "role"]
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({"message": f"{field} is required"}), 400

    name = data["name"]
    email = data["email"]
    password = data["password"]
    role = data["role"]

    # SECURITY: Only allow 'employee' registration via this public endpoint
    if role != "employee":
        return jsonify({"message": "Public registration is restricted to employees only. Contact admin for other roles."}), 403

    # Validate password length
    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters long"}), 400

    db = SessionLocal()
    
    # Check if email exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        db.close()
        return jsonify({"message": "Email already exists"}), 409

    # Create new user
    new_user = User(
        name=name,
        email=email,
        password_hash=generate_password_hash(password),
        role=role 
    )
    
    db.add(new_user)
    db.commit()
    db.close()

    return jsonify({"message": "Registration successful. Please login."}), 201


# ==============================
# GET PROFILE (PROTECTED)
# ==============================
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        db.close()
        return jsonify({"message": "User not found"}), 404
        
    user_data = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.strftime("%Y-%m-%d")
    }
    db.close()
    
    return jsonify(user_data), 200


# ==============================
# UPDATE PROFILE (PROTECTED)
# ==============================
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    from flask_jwt_extended import get_jwt_identity
    user_id = int(get_jwt_identity())
    
    data = request.get_json()
    if not data:
        return jsonify({"message": "Request body required"}), 400
        
    db = SessionLocal()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        db.close()
        return jsonify({"message": "User not found"}), 404
        
    # Allow updating Name. Email/Role restricted.
    # Allow updating Name. Email/Role restricted.
    if "name" in data:
        user.name = data["name"]
        
    db.commit()
    
    # Extract data before closing
    updated_user = {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }
    
    db.close()
    
    return jsonify({
        "message": "Profile updated successfully",
        "user": updated_user
    }), 200
