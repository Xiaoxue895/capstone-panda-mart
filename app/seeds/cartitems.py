from app.models import db, CartItem, environment, SCHEMA
from sqlalchemy.sql import text


def seed_cart_items():
    cart_items_data = [
        {"cart_id": 1, "product_id": 1, "quantity": 2, "gift": False},  
        {"cart_id": 1, "product_id": 2, "quantity": 1, "gift": True},  
        {"cart_id": 2, "product_id": 3, "quantity": 3, "gift": False},  
        {"cart_id": 2, "product_id": 4, "quantity": 1, "gift": False},  
        {"cart_id": 3, "product_id": 1, "quantity": 1, "gift": True},  
        {"cart_id": 4, "product_id": 2, "quantity": 2, "gift": False}, 
        {"cart_id": 5, "product_id": 3, "quantity": 5, "gift": False}, 
    ]

    cart_items = []
    for item_data in cart_items_data:
        cart_item = CartItem(
            cart_id=item_data['cart_id'],
            product_id=item_data['product_id'],
            quantity=item_data['quantity'],
            gift=item_data['gift']
        )
        cart_items.append(cart_item)

    db.session.add_all(cart_items)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the cart_items table. SQLAlchemy doesn't
# have a built-in function to do this. With Postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_cart_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.cart_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM cart_items"))
        
    db.session.commit()
