from app.models import db, ProductImage, environment, SCHEMA
from sqlalchemy.sql import text


def seed_product_images():
    product_images_data = [
        {"product_id": 1, "image": "images/1.webp", "preview": True},
        {"product_id": 1, "image": "images/2.webp", "preview": False},
        {"product_id": 1, "image": "images/3.webp", "preview": False},
        {"product_id": 1, "image": "images/4.webp", "preview": False},
        {"product_id": 1, "image": "images/5.webp", "preview": False},
        {"product_id": 2, "image": "images/6.webp", "preview": True},
        {"product_id": 2, "image": "images/7.webp", "preview": False},
        {"product_id": 2, "image": "images/8.webp", "preview": False},
        {"product_id": 2, "image": "images/9.webp", "preview": False},
        {"product_id": 2, "image": "images/10.webp", "preview": False},
        {"product_id": 3, "image": "images/11.webp", "preview": True},
        {"product_id": 3, "image": "images/12.webp", "preview": False},
        {"product_id": 3, "image": "images/13.webp", "preview": False},
        {"product_id": 3, "image": "images/14.webp", "preview": False},
        {"product_id": 3, "image": "images/15.webp", "preview": False},
        {"product_id": 4, "image": "images/16.webp", "preview": True},
        {"product_id": 4, "image": "images/17.webp", "preview": False},
        {"product_id": 4, "image": "images/18.webp", "preview": False},
        {"product_id": 4, "image": "images/19.webp", "preview": False},
        {"product_id": 4, "image": "images/20.webp", "preview": False},
        {"product_id": 5, "image": "images/21.webp", "preview": True},
        {"product_id": 5, "image": "images/22.webp", "preview": False},
        {"product_id": 5, "image": "images/23.webp", "preview": False},
        {"product_id": 5, "image": "images/24.webp", "preview": False},
        {"product_id": 5, "image": "images/25.webp", "preview": False},
        {"product_id": 6, "image": "images/26.webp", "preview": True},
        {"product_id": 6, "image": "images/27.webp", "preview": False},
        {"product_id": 6, "image": "images/28.webp", "preview": False},
        {"product_id": 6, "image": "images/29.webp", "preview": False},
        {"product_id": 6, "image": "images/30.webp", "preview": False},
        {"product_id": 7, "image": "images/31.webp", "preview": True},
        {"product_id": 7, "image": "images/32.webp", "preview": False},
        {"product_id": 7, "image": "images/33.webp", "preview": False},
        {"product_id": 7, "image": "images/34.webp", "preview": False},
        {"product_id": 7, "image": "images/35.webp", "preview": False},
        {"product_id": 8, "image": "images/36.webp", "preview": True},
        {"product_id": 8, "image": "images/37.webp", "preview": False},
        {"product_id": 8, "image": "images/38.webp", "preview": False},
        {"product_id": 8, "image": "images/39.webp", "preview": False},
        {"product_id": 8, "image": "images/40.webp", "preview": False},
        {"product_id": 9, "image": "images/41.webp", "preview": True},
        {"product_id": 9, "image": "images/42.webp", "preview": False},
        {"product_id": 9, "image": "images/43.webp", "preview": False},
        {"product_id": 9, "image": "images/44.webp", "preview": False},
        {"product_id": 9, "image": "images/45.webp", "preview": False},
        {"product_id": 10, "image": "images/46.webp", "preview": True},
        {"product_id": 10, "image": "images/47.webp", "preview": False},
        {"product_id": 10, "image": "images/48.webp", "preview": False},
        {"product_id": 10, "image": "images/49.webp", "preview": False},
        {"product_id": 10, "image": "images/50.webp", "preview": False},
        {"product_id": 11, "image": "images/51.webp", "preview": True},
        {"product_id": 11, "image": "images/52.webp", "preview": False},
        {"product_id": 11, "image": "images/53.webp", "preview": False},
        {"product_id": 11, "image": "images/54.webp", "preview": False},
        {"product_id": 11, "image": "images/55.webp", "preview": False},
        {"product_id": 12, "image": "images/56.webp", "preview": True},
        {"product_id": 12, "image": "images/57.webp", "preview": False},
        {"product_id": 12, "image": "images/58.webp", "preview": False},
        {"product_id": 12, "image": "images/59.webp", "preview": False},
        {"product_id": 12, "image": "images/60.webp", "preview": False},
        {"product_id": 13, "image": "images/61.webp", "preview": True},
        {"product_id": 13, "image": "images/62.webp", "preview": False},
        {"product_id": 13, "image": "images/63.webp", "preview": False},
        {"product_id": 13, "image": "images/64.webp", "preview": False},
        {"product_id": 13, "image": "images/65.webp", "preview": False},
        {"product_id": 14, "image": "images/66.webp", "preview": True},
        {"product_id": 14, "image": "images/67.webp", "preview": False},
        {"product_id": 14, "image": "images/68.webp", "preview": False},
        {"product_id": 14, "image": "images/69.webp", "preview": False},
        {"product_id": 14, "image": "images/70.webp", "preview": False},
        {"product_id": 15, "image": "images/71.webp", "preview": True},
        {"product_id": 15, "image": "images/72.webp", "preview": False},
        {"product_id": 15, "image": "images/73.webp", "preview": False},
        {"product_id": 15, "image": "images/74.webp", "preview": False},
        {"product_id": 15, "image": "images/75.webp", "preview": False},
        {"product_id": 16, "image": "images/76.webp", "preview": True},
        {"product_id": 16, "image": "images/77.webp", "preview": False},
        {"product_id": 16, "image": "images/78.webp", "preview": False},
        {"product_id": 16, "image": "images/79.webp", "preview": False},
        {"product_id": 16, "image": "images/80.webp", "preview": False},
        {"product_id": 17, "image": "images/81.webp", "preview": True},
        {"product_id": 17, "image": "images/82.webp", "preview": False},
        {"product_id": 17, "image": "images/83.webp", "preview": False},
        {"product_id": 17, "image": "images/84.webp", "preview": False},
        {"product_id": 17, "image": "images/85.webp", "preview": False},
        {"product_id": 18, "image": "images/86.webp", "preview": True},
        {"product_id": 18, "image": "images/87.webp", "preview": False},
        {"product_id": 18, "image": "images/88.webp", "preview": False},
        {"product_id": 18, "image": "images/89.webp", "preview": False},
        {"product_id": 18, "image": "images/90.webp", "preview": False},
        {"product_id": 19, "image": "images/91.webp", "preview": True},
        {"product_id": 19, "image": "images/92.webp", "preview": False},
        {"product_id": 19, "image": "images/93.webp", "preview": False},
        {"product_id": 19, "image": "images/94.webp", "preview": False},
        {"product_id": 19, "image": "images/95.webp", "preview": False},
        {"product_id": 20, "image": "images/96.webp", "preview": True},
        {"product_id": 20, "image": "images/97.webp", "preview": False},
        {"product_id": 20, "image": "images/98.webp", "preview": False},
        {"product_id": 20, "image": "images/99.webp", "preview": False},
        {"product_id": 20, "image": "images/100.webp", "preview": False},
    ]


    product_images = []
    for image_data in product_images_data:
        product_image = ProductImage(
            product_id=image_data['product_id'],
            image=image_data['image'],  
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

