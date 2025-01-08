from app.models import db, Category, environment, SCHEMA
from sqlalchemy.sql import text


def seed_categories():
    categories_data = [
        {"type": "Electronics"},
        {"type": "Fashion"},
        {"type": "Home & Kitchen"},
        {"type": "Sports & Outdoors"},
        {"type": "Health & Beauty"},
        {"type": "Books"},
        {"type": "Toys & Games"},
        {"type": "Automotive"},
        {"type": "Groceries"},
        {"type": "Music & Movies"}
    ]

    categories = []
    for category_data in categories_data:
        category = Category(
            type=category_data['type']
        )
        categories.append(category)

    db.session.add_all(categories)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the categories table. SQLAlchemy doesn't
# have a built-in function to do this. With Postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_categories():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.categories RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM categories"))
        
    db.session.commit()
