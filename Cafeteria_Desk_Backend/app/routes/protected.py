from flask import Blueprint, jsonify
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity,
    get_jwt
)

protected_bp = Blueprint(
    "protected",
    __name__,
    url_prefix="/protected"
)


@protected_bp.route("/me", methods=["GET"])
@jwt_required()
def me():
    """
    This endpoint returns the currently logged-in user's
    ID and role (from JWT token).
    """

    # Extract user ID from token
    user_id = get_jwt_identity()

    # Extract extra claims (like role)
    claims = get_jwt()

    return jsonify({
        "message": "Protected route accessed successfully",
        "user_id": user_id,
        "role": claims["role"]
    }), 200
