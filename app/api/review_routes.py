from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from ..models import db, Review, Product
from ..forms import ReviewForm

review_routes = Blueprint("reviews", __name__)


# 7.3 Edit a Review
@review_routes.route("/<int:review_id>", methods=["PUT"])
@login_required
def update_review(review_id):
    form = ReviewForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    review = Review.query.get(review_id)
    if not review:
        return {"error": "Review not found"}, 404

    if review.user_id != current_user.id:
        return {"error": "You can only edit your own reviews."}, 403
    
    if form.validate_on_submit():
        if form.data.get("review"):
            review.review = form.data["review"]
        if form.data.get("stars"):
            review.stars = form.data["stars"]
        if form.data.get("recommendation") is not None:
            review.recommendation = form.data["recommendation"]

        db.session.commit()

        return review.to_dict(), 200

    return jsonify(form.errors), 400


# 7.4 Delete a Review

@review_routes.route("/<int:review_id>", methods=["DELETE"])
@login_required
def delete_review(review_id):
    review = Review.query.get(review_id)
    if not review:
        return {"error": "Review not found"}, 404

    if review.user_id != current_user.id:
        return {"error": "You can only delete your own reviews."}, 403
    db.session.delete(review)
    db.session.commit()

    return {"message": "Review deleted successfully."}, 200
