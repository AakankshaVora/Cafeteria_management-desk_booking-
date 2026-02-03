from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

from app.database import SessionLocal
from app.models.review import Review
from app.models.user import User

reviews_bp = Blueprint("reviews", __name__, url_prefix="/reviews")


@reviews_bp.route("", methods=["POST"])
@jwt_required()
def create_review():
    data = request.get_json()
    if not data or "rating" not in data:
        return jsonify({"message": "Rating required"}), 400

    user_id = int(get_jwt_identity())
    
    db = SessionLocal()
    review = Review(
        user_id=user_id,
        rating=int(data["rating"]),
        feedback=data.get("feedback", "")
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    db.close()
    
    return jsonify({"message": "Review submitted successfully", "review_id": review.id}), 201


@reviews_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_reviews():
    user_id = int(get_jwt_identity())
    
    db = SessionLocal()
    reviews = db.query(Review).filter(
        Review.user_id == user_id
    ).all()
    
    result = []
    for r in reviews:
        result.append({
            "id": r.id,
            "rating": r.rating,
            "feedback": r.feedback,
            "created_at": r.created_at
        })
    db.close()
    
    return jsonify(result), 200
