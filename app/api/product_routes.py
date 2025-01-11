from flask import Blueprint,jsonify,request
from flask_login import login_required,current_user
from app.models import db,Product,ProductImage,Category,Review,Cart,CartItem

from ..forms import ProductForm,ProductImageForm,ReviewForm
from .aws_helpers import get_unique_filename,upload_file_to_s3,remove_file_from_s3

product_routes = Blueprint('products',__name__)

# 2.1 Get all Products
@product_routes.route('/',methods=['GET'])
@login_required
def get_all_products():

    products = Product.query.all()
    return {'products':[product.to_dict() for product in products]}

# 2.2 Get all products by specific categroies
@product_routes.route('/category/<int:category_id>',methods=['GET'])
def get_products_by_category(categoty_id):

    products = Product.query.filter_by(categoty_id = categoty_id).all()
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
@product_routes.route("/create", methods=["POST"])
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
@product_routes.route('/<int:id>', methods=['PUT'])
@login_required
def edit_product(id):
    product = Product.query.get(id)
    if not product:
        return {'error': 'Product not found'}, 404

    if product.seller_id != current_user.id:
        return {'error': 'Permission denied'}, 403

    form = ProductForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        product.name = form.data['name']
        product.description = form.data['description']
        product.inventory = form.data['inventory']
        product.price = form.data['price']
        product.category_id = form.data['category_id']

        db.session.commit()
        return product.to_dict(), 200  
    else:
        return form.errors, 400 

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

