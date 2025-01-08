from .db import db
from .user import User
from .cart import Cart
from .cart import CartItem
from .favorite import Favorite
from .product import Product
from .product import ProductImage
from .product import Category
from .review import Review
from .db import environment, SCHEMA

# all the relationships here
# one to many:
# user_cart unique?
# user_favorite
# user/seller_product
# user_review

# product_image
# product_review
# product_favorite
# product_cartitem

# category_product
# cart_cartitem

