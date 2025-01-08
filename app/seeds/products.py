from app.models import db,Product,environment, SCHEMA
from sqlalchemy.sql import text

def seed_products():
    products_data = [
        {"seller_id": 1, "category_id": 1, "name": "Product 1", "description": "Description for Product 1", "inventory": 100, "price": 1000},
        {"seller_id": 1, "category_id": 2, "name": "Product 2", "description": "Description for Product 2", "inventory": 150, "price": 1200},
        {"seller_id": 2, "category_id": 3, "name": "Product 3", "description": "Description for Product 3", "inventory": 200, "price": 800},
        {"seller_id": 2, "category_id": 4, "name": "Product 4", "description": "Description for Product 4", "inventory": 50, "price": 1500},
        {"seller_id": 3, "category_id": 5, "name": "Product 5", "description": "Description for Product 5", "inventory": 300, "price": 950},
        {"seller_id": 3, "category_id": 6, "name": "Product 6", "description": "Description for Product 6", "inventory": 80, "price": 2000},
        {"seller_id": 4, "category_id": 7, "name": "Product 7", "description": "Description for Product 7", "inventory": 120, "price": 1300},
        {"seller_id": 4, "category_id": 8, "name": "Product 8", "description": "Description for Product 8", "inventory": 60, "price": 1100},
        {"seller_id": 5, "category_id": 9, "name": "Product 9", "description": "Description for Product 9", "inventory": 50, "price": 950},
        {"seller_id": 5, "category_id": 10, "name": "Product 10", "description": "Description for Product 10", "inventory": 100, "price": 1050},
        {"seller_id": 1, "category_id": 1, "name": "Product 11", "description": "Description for Product 11", "inventory": 200, "price": 1250},
        {"seller_id": 1, "category_id": 2, "name": "Product 12", "description": "Description for Product 12", "inventory": 150, "price": 1400},
        {"seller_id": 2, "category_id": 3, "name": "Product 13", "description": "Description for Product 13", "inventory": 250, "price": 1050},
        {"seller_id": 2, "category_id": 4, "name": "Product 14", "description": "Description for Product 14", "inventory": 300, "price": 900},
        {"seller_id": 3, "category_id": 5, "name": "Product 15", "description": "Description for Product 15", "inventory": 50, "price": 1700},
        {"seller_id": 3, "category_id": 6, "name": "Product 16", "description": "Description for Product 16", "inventory": 120, "price": 1100},
        {"seller_id": 4, "category_id": 7, "name": "Product 17", "description": "Description for Product 17", "inventory": 200, "price": 1150},
        {"seller_id": 4, "category_id": 8, "name": "Product 18", "description": "Description for Product 18", "inventory": 80, "price": 950},
        {"seller_id": 5, "category_id": 9, "name": "Product 19", "description": "Description for Product 19", "inventory": 150, "price": 1200},
        {"seller_id": 5, "category_id": 10, "name": "Product 20", "description": "Description for Product 20", "inventory": 100, "price": 1100},
    ]
    products = []

    for product_data in products_data:
        product = Product(
            seller_id=product_data["seller_id"],
            category_id=product_data["category_id"],
            name=product_data["name"],
            description=product_data["description"],
            inventory=product_data["inventory"],
            price=product_data["price"],
        )
        products.append(product)
    db.session.add_all(products)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.

def undo_products():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.products RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM products"))
        
    db.session.commit()
