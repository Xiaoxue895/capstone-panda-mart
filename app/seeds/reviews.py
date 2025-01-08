from app.models import db, Review, environment, SCHEMA
from sqlalchemy.sql import text


def seed_reviews():
    reviews_data = [
        {"user_id": 1, "product_id": 1, "review": "Great product!", "stars": 5, "recommendation": True},
        {"user_id": 2, "product_id": 2, "review": "Not bad, but could be better.", "stars": 3, "recommendation": False},
        {"user_id": 3, "product_id": 3, "review": "Amazing quality! Worth the price.", "stars": 5, "recommendation": True},
        {"user_id": 4, "product_id": 4, "review": "Wouldn't recommend. Poor value.", "stars": 2, "recommendation": False},
        {"user_id": 5, "product_id": 5, "review": "Nice, but it arrived late.", "stars": 4, "recommendation": True},
        {"user_id": 1, "product_id": 6, "review": "Decent product, met my expectations.", "stars": 4, "recommendation": True},
        {"user_id": 2, "product_id": 7, "review": "I like it! Quality is good.", "stars": 4, "recommendation": True},
        {"user_id": 3, "product_id": 8, "review": "Not worth the price.", "stars": 1, "recommendation": False},
        {"user_id": 4, "product_id": 9, "review": "Absolutely love it! Highly recommend.", "stars": 5, "recommendation": True},
        {"user_id": 5, "product_id": 10, "review": "It's okay, but there's better out there.", "stars": 3, "recommendation": False},
        {"user_id": 1, "product_id": 11, "review": "Fantastic experience. I'm satisfied!", "stars": 5, "recommendation": True},
        {"user_id": 2, "product_id": 12, "review": "Good, but there's some room for improvement.", "stars": 3, "recommendation": True},
        {"user_id": 3, "product_id": 13, "review": "Will definitely purchase again.", "stars": 4, "recommendation": True},
        {"user_id": 4, "product_id": 14, "review": "Not what I expected, quite disappointing.", "stars": 2, "recommendation": False},
        {"user_id": 5, "product_id": 15, "review": "I'm loving it! Feels premium.", "stars": 5, "recommendation": True},
    ]

    reviews = []
    for review_data in reviews_data:
        review = Review(
            user_id=review_data['user_id'],
            product_id=review_data['product_id'],
            review=review_data['review'],
            stars=review_data['stars'],
            recommendation=review_data['recommendation']
        )
        reviews.append(review)

    db.session.add_all(reviews)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the reviews table. SQLAlchemy doesn't
# have a built-in function to do this. With Postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))
        
    db.session.commit()
