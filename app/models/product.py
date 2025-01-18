from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy import func

class Product(db.Model):
    __tablename__ = "products"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("categories.id")), nullable=False)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.Text)
    inventory = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())

    category = db.relationship("Category", back_populates="products")
    seller = db.relationship("User", back_populates="products")

    images = db.relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")
    products_reviews = db.relationship("Review", back_populates="product", cascade="all, delete-orphan")
    favorites = db.relationship("Favorite", back_populates="product", cascade="all, delete-orphan")
    cart_items = db.relationship("CartItem", cascade="all, delete-orphan", back_populates="product")


    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "inventory": self.inventory,
            "price": self.price,
            "category_id": self.category_id,
            "category_type": self.category.type if self.category else None,
            "seller_username": self.seller.username if self.seller else None, 
            "seller_id": self.seller_id,
            "images": [image.to_dict() for image in self.images] 
        }


class ProductImage(db.Model):
    __tablename__ = "product_images"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("products.id")), nullable=False)
    image = db.Column(db.Text, nullable=False)
    preview = db.Column(db.Boolean, nullable=False)
    created_at = db.Column(db.DateTime, server_default=func.now())
    updated_at = db.Column(db.DateTime, onupdate=func.now())

    product = db.relationship("Product", back_populates="images")

    def to_dict(self):
        return {
            "id": self.id,
            "product_id": self.product_id,
            "image": self.image,
            "preview": self.preview
        }


class Category(db.Model):
    __tablename__ = "categories"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String, nullable=False)

    products = db.relationship("Product", back_populates="category")

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type
            }