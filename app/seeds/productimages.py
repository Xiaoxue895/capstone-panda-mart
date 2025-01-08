from app.models import db, ProductImage, environment, SCHEMA
from sqlalchemy.sql import text


def seed_product_images():
    product_images_data = [
        {"product_id": 1, "url": "images/image1.jpg", "preview": True},
        {"product_id": 1, "url": "images/image2.jpg", "preview": False},
        {"product_id": 1, "url": "images/image3.jpg", "preview": False},
        {"product_id": 2, "url": "images/image1.jpg", "preview": True},
        {"product_id": 2, "url": "images/image3.jpg", "preview": False},
        {"product_id": 3, "url": "images/image2.jpg", "preview": True},
        {"product_id": 3, "url": "images/image1.jpg", "preview": False},
        {"product_id": 4, "url": "images/image2.jpg", "preview": True},
        {"product_id": 4, "url": "images/image3.jpg", "preview": False},
        {"product_id": 5, "url": "images/image3.jpg", "preview": True},
        {"product_id": 5, "url": "images/image1.jpg", "preview": False},
        {"product_id": 6, "url": "images/image1.jpg", "preview": True},
        {"product_id": 6, "url": "images/image2.jpg", "preview": False},
        {"product_id": 7, "url": "images/image2.jpg", "preview": True},
        {"product_id": 7, "url": "images/image3.jpg", "preview": False},
        {"product_id": 8, "url": "images/image1.jpg", "preview": True},
        {"product_id": 8, "url": "images/image2.jpg", "preview": False},
        {"product_id": 9, "url": "images/image1.jpg", "preview": True},
        {"product_id": 9, "url": "images/image3.jpg", "preview": False},
        {"product_id": 10, "url": "images/image2.jpg", "preview": True},
        {"product_id": 10, "url": "images/image3.jpg", "preview": False},
        {"product_id": 11, "url": "images/image1.jpg", "preview": True},
        {"product_id": 11, "url": "images/image2.jpg", "preview": False},
        {"product_id": 12, "url": "images/image3.jpg", "preview": True},
        {"product_id": 12, "url": "images/image2.jpg", "preview": False},
        {"product_id": 13, "url": "images/image1.jpg", "preview": True},
        {"product_id": 13, "url": "images/image2.jpg", "preview": False},
        {"product_id": 14, "url": "images/image3.jpg", "preview": True},
        {"product_id": 14, "url": "images/image1.jpg", "preview": False},
        {"product_id": 15, "url": "images/image2.jpg", "preview": True},
        {"product_id": 15, "url": "images/image3.jpg", "preview": False},
        {"product_id": 16, "url": "images/image1.jpg", "preview": True},
        {"product_id": 16, "url": "images/image3.jpg", "preview": False},
        {"product_id": 17, "url": "images/image2.jpg", "preview": True},
        {"product_id": 17, "url": "images/image1.jpg", "preview": False},
        {"product_id": 18, "url": "images/image1.jpg", "preview": True},
        {"product_id": 18, "url": "images/image3.jpg", "preview": False},
        {"product_id": 19, "url": "images/image3.jpg", "preview": True},
        {"product_id": 19, "url": "images/image2.jpg", "preview": False},
        {"product_id": 20, "url": "images/image2.jpg", "preview": True},
        {"product_id": 20, "url": "images/image1.jpg", "preview": False}
    ]

    product_images = []
    for image_data in product_images_data:
        product_image = ProductImage(
            product_id=image_data['product_id'],
            url=image_data['url'],
            preview=image_data['preview']
        )
        product_images.append(product_image)

    db.session.add_all(product_images)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the product_images table. SQLAlchemy doesn't
# have a built-in function to do this. With Postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities. With
# SQLite in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_product_images():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.product_images RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM product_images"))
        
    db.session.commit()
