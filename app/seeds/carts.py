from app.models import db, Cart, environment, SCHEMA
from sqlalchemy.sql import text


def seed_cart():
    carts_data = [
        {"user_id": 1},
        {"user_id": 2},
        {"user_id": 3},
        {"user_id": 4},
        {"user_id": 5}
    ]

    carts = []
    for cart_data in carts_data:
        cart = Cart(
            user_id=cart_data['user_id']
        )
        carts.append(cart)

    db.session.add_all(carts)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the carts table. SQLAlchemy doesn't
# have a built-in function to do this. With Postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_cart():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.carts RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM carts"))
        
    db.session.commit()
