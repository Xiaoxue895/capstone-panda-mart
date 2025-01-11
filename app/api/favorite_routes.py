from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from ..models import db, Favorite, Product

favorite_routes = Blueprint("favorites", __name__)

# 5.1 Get All Favorites for the Current User
@favorite_routes.route('/', methods=['GET'])
@login_required
def get_all_favorites():
    favorites = Favorite.query.filter_by(user_id=current_user.id).all()

    if not favorites:
        return {'error': 'No favorites found for this user'}, 404

    return jsonify([favorite.to_dict() for favorite in favorites])

# 5.2 Add a Product to Favorites
@favorite_routes.route('/', methods=['POST'])
@login_required
def add_to_favorites():

    productId = request.get_json()
    preFavs = (
        Favorite.query.filter(Favorite.product_id == productId)
        .filter(Favorite.user_id == current_user.id)
        .first()
    )

    if not preFavs:
        new_favorite = Favorite(product_id=productId, user_id=current_user.id)
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

