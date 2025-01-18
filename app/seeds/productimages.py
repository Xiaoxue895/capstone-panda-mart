from app.models import db, ProductImage, environment, SCHEMA
from sqlalchemy.sql import text


def seed_product_images():
    product_images_data = [
        {"product_id": 1, "image": "images/image1.jpg", "preview": True},
        {"product_id": 1, "image": "images/image2.jpg", "preview": False},
        {"product_id": 1, "image": "images/image3.jpg", "preview": False},
        {"product_id": 2, "image": "images/image1.jpg", "preview": True},
        {"product_id": 2, "image": "images/image3.jpg", "preview": False},
        {"product_id": 3, "image": "images/image2.jpg", "preview": True},
        {"product_id": 3, "image": "images/image1.jpg", "preview": False},
        {"product_id": 4, "image": "images/image2.jpg", "preview": True},
        {"product_id": 4, "image": "images/image3.jpg", "preview": False},
        {"product_id": 5, "image": "images/image3.jpg", "preview": True},
        {"product_id": 5, "image": "images/image1.jpg", "preview": False},
        {"product_id": 6, "image": "images/image1.jpg", "preview": True},
        {"product_id": 6, "image": "images/image2.jpg", "preview": False},
        {"product_id": 7, "image": "images/image2.jpg", "preview": True},
        {"product_id": 7, "image": "images/image3.jpg", "preview": False},
        {"product_id": 8, "image": "images/image1.jpg", "preview": True},
        {"product_id": 8, "image": "images/image2.jpg", "preview": False},
        {"product_id": 9, "image": "images/image1.jpg", "preview": True},
        {"product_id": 9, "image": "images/image3.jpg", "preview": False},
        {"product_id": 10, "image": "images/image2.jpg", "preview": True},
        {"product_id": 10, "image": "images/image3.jpg", "preview": False},
        {"product_id": 11, "image": "images/image1.jpg", "preview": True},
        {"product_id": 11, "image": "images/image2.jpg", "preview": False},
        {"product_id": 12, "image": "images/image3.jpg", "preview": True},
        {"product_id": 12, "image": "images/image2.jpg", "preview": False},
        {"product_id": 13, "image": "images/image1.jpg", "preview": True},
        {"product_id": 13, "image": "images/image2.jpg", "preview": False},
        {"product_id": 14, "image": "images/image3.jpg", "preview": True},
        {"product_id": 14, "image": "images/image1.jpg", "preview": False},
        {"product_id": 15, "image": "images/image2.jpg", "preview": True},
        {"product_id": 15, "image": "images/image3.jpg", "preview": False},
        {"product_id": 16, "image": "images/image1.jpg", "preview": True},
        {"product_id": 16, "image": "images/image3.jpg", "preview": False},
        {"product_id": 17, "image": "images/image2.jpg", "preview": True},
        {"product_id": 17, "image": "images/image1.jpg", "preview": False},
        {"product_id": 18, "image": "images/image1.jpg", "preview": True},
        {"product_id": 18, "image": "images/image3.jpg", "preview": False},
        {"product_id": 19, "image": "images/image3.jpg", "preview": True},
        {"product_id": 19, "image": "images/image2.jpg", "preview": False},
        {"product_id": 20, "image": "images/image2.jpg", "preview": True},
        {"product_id": 20, "image": "images/image1.jpg", "preview": False}
    ]

    product_images = []
    for image_data in product_images_data:
        product_image = ProductImage(
            product_id=image_data['product_id'],
            image=image_data['image'],  # 将url字段改为image
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

