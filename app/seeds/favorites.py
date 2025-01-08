from app.models import db, Favorite, environment, SCHEMA
from sqlalchemy.sql import text


def seed_favorites():
    favorites_data = [
        {"user_id": 1, "product_id": 1},
        {"user_id": 1, "product_id": 2},
        {"user_id": 2, "product_id": 3},
        {"user_id": 2, "product_id": 4},
        {"user_id": 3, "product_id": 5},
        {"user_id": 3, "product_id": 6},
        {"user_id": 4, "product_id": 7},
        {"user_id": 4, "product_id": 8},
        {"user_id": 5, "product_id": 9},
        {"user_id": 5, "product_id": 10},
        {"user_id": 1, "product_id": 11},
        {"user_id": 2, "product_id": 12},
        {"user_id": 3, "product_id": 13},
        {"user_id": 4, "product_id": 14},
        {"user_id": 5, "product_id": 15},
    ]

    favorites = []
    for favorite_data in favorites_data:
        favorite = Favorite(
            user_id=favorite_data['user_id'],
            product_id=favorite_data['product_id']
        )
        favorites.append(favorite)

    db.session.add_all(favorites)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the favorites table. SQLAlchemy doesn't
# have a built-in function to do this. With Postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_favorites():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.favorites RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM favorites"))
        
    db.session.commit()
