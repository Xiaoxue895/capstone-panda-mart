from flask import Blueprint,jsonify,request
from flask_login import login_required,current_user
from app.models import db,Product,ProductImage,Review

from ..forms import ProductForm,ProductImageForm,ReviewForm
from .aws_helpers import get_unique_filename,upload_file_to_s3,remove_file_from_s3
from sqlalchemy import func

product_routes = Blueprint('products',__name__)

# 2.1 Get all Products
@product_routes.route('/',methods=['GET'])
@login_required
def get_all_products():

    products = Product.query.all()
    return {'products':[product.to_dict() for product in products]}


# 2.2.2 Get all Products owned by the Current User
@product_routes.route('/user/current', methods=['GET'])
@login_required
def get_products_by_current_user():

    products = Product.query.filter_by(seller_id=current_user.id).all()
    return {'products': [product.to_dict() for product in products]}

# ????????
# 2.2.5 Get all Products owned by specific user id 
@product_routes.route('/user/<int:user_id>', methods=['GET'])
def get_products_by_user(user_id):

    products = Product.query.filter_by(seller_id=user_id).all()
    return {'products': [product.to_dict() for product in products]}

# 2.3 Get details of a Products from an id
@product_routes.route('/<int:id>', methods=['GET'])
def get_product_details(id):

    product = Product.query.get(id)
    if not product:
        return {'error': 'Product not found'}, 404
    return product.to_dict()

# 2.4 Create a Products
@product_routes.route("/", methods=["POST"])
@login_required
def create_product():
    form = ProductForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        new_product = Product(
            name=form.data["name"],
            description=form.data["description"],
            inventory=form.data["inventory"],
            price=form.data["price"],
            seller_id=current_user.id,
            category_id=form.data["category_id"],
        )
        db.session.add(new_product)
        db.session.commit()
        return new_product.to_dict(), 201
    else:
        print("Form errors:", form.errors)
        return form.errors, 400
    

# 2.6 Edit Product by id
@product_routes.route('/<int:id>', methods=['PATCH'])
@login_required
def edit_product(id):
    product = Product.query.get(id)
    if not product:
        return {'error': 'Product not found'}, 404

    if product.seller_id != current_user.id:
        return {'error': 'Permission denied'}, 403

    data = request.get_json()

    product.name = data.get('name', product.name)
    product.description = data.get('description', product.description)
    product.inventory = data.get('inventory', product.inventory)
    product.price = data.get('price', product.price)
    product.category_id = data.get('category_id', product.category_id)

    db.session.commit()
    return product.to_dict(), 200  

# 2.7 Delete Product by id
@product_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_product(id):

    product = Product.query.get(id)
    if not product:
        return {'error': 'Product not found'}, 404

    if product.seller_id != current_user.id:
        return {'error': 'Permission denied'}, 403

    db.session.delete(product)
    db.session.commit()
    return jsonify({'message': 'Product deleted successfully'})


@product_routes.route('/<int:product_id>/images', methods=["GET"])
def get_product_images(product_id):
    images = ProductImage.query.filter(ProductImage.product_id == product_id).all()
    return jsonify({image.id: image.to_dict() for image in images})

# add Images for product
@product_routes.route('/<int:product_id>/images', methods=["POST"])
@login_required
def add_images(product_id):
    form = ProductImageForm()
    form["csrf_token"].data = request.cookies["csrf_token"]

    if form.validate_on_submit():
        image = form.data["image"]
        image.filename = get_unique_filename(image.filename)
        upload = upload_file_to_s3(image)

        if "url" not in upload:
            return {"errors": upload}, 400

        url = upload["url"]
        new_image = ProductImage(
            product_id=product_id,
            url=url,
            preview=form.data["preview"],
        )
        db.session.add(new_image)
        db.session.commit()
        return new_image.to_dict(), 201
    else:
        print("Form errors:", form.errors)
        return form.errors, 400
    
# Delete an image from a product
@product_routes.route("/<int:product_id>/images/<int:imageId>", methods=["DELETE"])
@login_required
def delete_image(product_id,imageId):
    product_image = ProductImage.query.get(imageId)
    if not product_image:
        return {"error": "Image not found"}, 404

    if product_image.product_id != product_id:
        return {"error": "Image does not belong to this product"}, 400

    if product_image:
        remove_file_from_s3(product_image.url)

        db.session.delete(product_image)
        db.session.commit()
        return {"message": "Image deleted successfully"}, 200
    

# 7.1 Get All Reviews for a Product
@product_routes.route('/<int:product_id>/reviews', methods=['GET'])
@login_required
def get_product_reviews(product_id):
    reviews = Review.query.filter_by(product_id=product_id).all()

    if not reviews:
        return {'message': 'No reviews found for this product'}, 200

    return jsonify([review.to_dict() for review in reviews])


# 7.1.2 get all review stats for a product（like average——stars，total_review)
@product_routes.route('/<int:product_id>/review-stats')
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
@product_routes.route('/<int:product_id>/current/reviews', methods=['GET'])
@login_required
def get_user_review_for_product(product_id):
    review = Review.query.filter_by(user_id=current_user.id, product_id=product_id).first()

    if not review:
        return {'error': 'Review not found for this product by the current user'}, 404
    
    return jsonify(review.to_dict())

# 7.2 Add a Review for a Product
@product_routes.route("/<int:product_id>/reviews", methods=["POST"])
@login_required
def create_review(product_id):
    form = ReviewForm()

    form["csrf_token"].data = request.cookies["csrf_token"]

    product_id = product_id

    preRev = (
        Review.query.filter(Review.user_id == current_user.id)
        .filter(Review.product_id == product_id)
        .first()
    )

    if preRev:
        return {"errors": {"You have already reviewed this product."}}, 400

    if form.validate_on_submit():
        new_review = Review(
            product_id=product_id,
            user_id=current_user.id,
            review=form.data["review"],
            stars=form.data["stars"],
            recommendation=form.data["recommendation"],
        )

        db.session.add(new_review)
        db.session.commit()
        return new_review.to_dict(),201
    
    return form.errors, 400
