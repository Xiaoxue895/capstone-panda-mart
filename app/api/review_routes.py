from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required
from ..models import db, Review, Product
from ..forms import ReviewForm
from sqlalchemy import func

review_routes = Blueprint("reviews", __name__)


# 7.1 Get All Reviews for a Product
@review_routes.route('/product/<int:product_id>', methods=['GET'])
@login_required
def get_product_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()
    if not reviews:
        return {'error': 'No reviews found for this product'}, 404

    return jsonify([review.to_dict() for review in reviews])


# 7.1.2 get all review stats for a product（like average——stars，total_review)
@review_routes.route('/review-stats/<int:product_id>')
def get_product_review_stats(product_id):

    review = db.session.query(
        Review.product_id,
        func.sum(Review.stars).label("stars_total"),
        func.count(Review.id).label('review_count'),
        func.avg(Review.stars).label('average_stars')
    ).filter(Review.product_id == product_id).group_by(Review.product_id).first()
    
    if not review:
        return {"stars_total": 0, "review_count": 0, "average_stars": 0}, 200
    
    result = {
        "product_id": review.product_id,
        "stars_total": review.stars_total,
        "review_count": review.review_count,
        "average_stars": review.average_stars if review.average_stars is not None else 0, 
    }
    return jsonify(result)


# 7.2 Get reviews for the current user and specific product
@review_routes.route('/user/<int:product_id>', methods=['GET'])
@login_required
def get_user_review_for_product(product_id):
    review = Review.query.filter_by(user_id=current_user.id, product_id=product_id).first()

    if not review:
        return {'error': 'Review not found for this product by the current user'}, 404
    
    return jsonify(review.to_dict())

# 7.2 Add a Review for a Product
@review_routes.route("/", methods=["POST"])
@login_required
def create_review():
    form = ReviewForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    product_id = form.data["product_Id"]

    preRev = (
        Review.query.filter(Review.user_id == current_user.id)
        .filter(Review.product_id == product_id)
        .first()
    )

    if preRev:
        return {"errors": {"You have already reviewed this product."}}, 500

    if form.validate_on_submit():
        new_review = Review(
            product_id=form.data["productId"],
            user_id=current_user.id,
            review=form.data["review"],
            stars=form.data["stars"],
            recommendation=form.data["recommendation"],
        )

        db.session.add(new_review)
        db.session.commit()
        return new_review.to_dict(),201
    
    return form.errors, 400


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
