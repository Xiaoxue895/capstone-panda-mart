from flask import Blueprint,jsonify,request
from flask_login import login_required,current_user
from app.models import Product

search_routes = Blueprint('search', __name__)

@search_routes.route('/product', methods=['GET'])
def search_products():
    wanted_product = request.args.get("input",'').strip()

    if not wanted_product:
        return jsonify({"message":"Which product you want to search?????"}),400
    
    product_result = Product.query.filter(
        Product.name.ilike(f'%{wanted_product}%') | 
        Product.description.ilike(f'%{wanted_product}%')
    ).all()


    result_list = []

    for product in product_result:
        result_list.append({
            "id": product.id,
            "name": product.name,
            "description": product.description,
            "price": product.price,
            "inventory": product.inventory,
            "category_id": product.category_id,
            "category_type": product.category.type if product.category else None, 
            "preview_image": next((image.image for image in product.images if image.preview), None)
        })

    return jsonify({'results_list':result_list},200)

# filter product by category
@search_routes.route('/category/<int:category_id>', methods=['GET'])
def filter_products_by_category(category_id):
    products = Product.query.filter_by(category_id=category_id).all()

    if not products:
        return jsonify({"message": "No products found for this category."}), 404

    result = {
        "category_id": category_id,
        "category_type": products[0].category.type if products[0].category else None,
        "products": [product.to_dict() for product in products]  
    }

    return jsonify(result), 200
