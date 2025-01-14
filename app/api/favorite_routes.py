from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Favorite, Product,ProductImage

favorite_routes = Blueprint("favorites", __name__)

# 5.1 Get All Favorites for the Current User
@favorite_routes.route('/', methods=['GET'])
@login_required
def get_all_favorites():
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()
    if not favorites:
        return {'error': 'No favorites found for this user'}, 404

    favorite_products = []
    for favorite in favorites:
        product = Product.query.get(favorite.product_id)
        if product:
            preview_image = (
                ProductImage.query.filter_by(product_id=product.id, preview=True)
                .order_by(ProductImage.id.asc())
                .first()
            )
            favorite_products.append({
                "favorite_id": favorite.id,
                "product": {
                    **product.to_dict(),
                    "preview_image": preview_image.url if preview_image else None
                }
            })

    return jsonify(favorite_products)

# 5.2 Add a Product to Favorites
@favorite_routes.route('/', methods=['POST'])
@login_required
def add_to_favorites():

    data = request.get_json()
    product_id = data.get('product_id') 
    if not product_id:
        return {"error": "Product ID is required"}, 400
    
    preFavs = (
        Favorite.query.filter(Favorite.product_id == product_id)
        .filter(Favorite.user_id == current_user.id)
        .first()
    )

    if not preFavs:
        new_favorite = Favorite(product_id=product_id, user_id=current_user.id)
        db.session.add(new_favorite)
        db.session.commit()
        return new_favorite.to_dict()

    return {"errors": {"message": "User already favorited this product."}}, 500

# 5.3 Remove a Product from Favorites
@favorite_routes.route('/<int:favorite_id>', methods=['DELETE'])
@login_required
def remove_from_favorites(favorite_id):
    favorite = Favorite.query.filter_by(id=favorite_id, user_id=current_user.id).first()

    if not favorite:
        return {"error": "Favorite not found for this user"}, 404

    db.session.delete(favorite)
    db.session.commit()

    return {"message": "Successfully removed from favorites", "favorite": favorite.to_dict()}, 200

