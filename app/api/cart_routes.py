from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from app.models import db, Cart, CartItem, Product

cart_routes = Blueprint('carts', __name__)

# 6.1 Get the Current User's Cart
@cart_routes.route('/', methods=['GET'])
@login_required
def get_cart():
    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return {'error': 'Cart not found'}, 404
    return cart.to_dict()

# 6.2 Add an Item to the Cart
@cart_routes.route('/item', methods=['POST'])
@login_required
def add_to_cart():

    data = request.get_json()
    product_id = data['product_id']
    quantity = data.get('quantity', 1) 
    gift = data.get('gift', False)

    product = Product.query.get(product_id)
    if not product:
        return {'error': 'Product not found'}, 404

    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return {'error': 'Cart not found'}, 404

    cart_item = CartItem.query.filter_by(cart_id=cart.id, product_id=product_id).first()

    if cart_item:
            total_quantity_in_cart = cart_item.quantity + quantity  
    else:
            total_quantity_in_cart = quantity 

    if total_quantity_in_cart > product.inventory:
            return {'error': f'Cannot add more than {product.inventory} items to the cart due to stock limits.'}, 400
    
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=product.id,
            quantity=quantity,
            gift=gift
        )
        db.session.add(cart_item)

    db.session.commit()
    return cart_item.to_dict(), 201

# 6.3 Update an Item in the Cart（for gift）
# 6.4 change the quantity we save in the cart（what is difference between 6.3-6.4）
@cart_routes.route('/item/<int:item_id>', methods=['PATCH'])
@login_required
def update_cart_item(item_id):
    data = request.get_json()
    quantity = data.get('quantity')

    cart_item = CartItem.query.get(item_id)
    if not cart_item:
        return {'error': 'Cart item not found'}, 404

    product = Product.query.get(cart_item.product_id)
    # if not product:
    #     return {'error': 'Product not found'}, 404

    if quantity is not None:
        if quantity < 1:
            return {'error': 'Quantity must be at least 1'}, 400

        if quantity > product.inventory:
            return {'error': f'Cannot set quantity greater than the available stock ({product.inventory})'}, 400
        
        cart_item.quantity = quantity

    db.session.commit()
    return cart_item.to_dict()


# 6.5 Delete all Item from the Cart
@cart_routes.route('/item', methods=['DELETE'])
@login_required
def delete_all_cart_items():

    cart = Cart.query.filter_by(user_id=current_user.id).first()
    if not cart:
        return {'error': 'Cart not found'}, 404

    CartItem.query.filter_by(cart_id=cart.id).delete()

    db.session.commit()
    return {'message': 'All items deleted from the cart successfully'}


# 6.6 Delete specific Item from the Cart

@cart_routes.route('/item/<int:item_id>', methods=['DELETE'])
@login_required
def delete_cart_item(item_id):

    cart_item = CartItem.query.get(item_id)
    if not cart_item:
        return {'error': 'Cart item not found'}, 404

    db.session.delete(cart_item)
    db.session.commit()
    return {'message': 'Cart item deleted successfully'}