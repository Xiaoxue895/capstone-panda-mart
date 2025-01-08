from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text

def seed_users():
    users_data = [
        {
            "firstname": "Demo",
            "lastname": "User",
            "username": "Demo",
            "email": "demo@aa.io",
            "password": "password",
            "profile_url": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            "account_balance": 1000.0,
        },
        {
            "firstname": "Marnie",
            "lastname": "Smith",
            "username": "marnie",
            "email": "marnie@aa.io",
            "password": "password",
            "profile_url": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            "account_balance": 1200.0,
        },
        {
            "firstname": "Bobbie",
            "lastname": "Johnson",
            "username": "bobbie",
            "email": "bobbie@aa.io",
            "password": "password",
            "profile_url": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            "account_balance": 800.0,
        },
        {
            "firstname": "Alice",
            "lastname": "Wang",
            "username": "alice",
            "email": "alice@aa.io",
            "password": "password",
            "profile_url": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            "account_balance": 1500.0,
        },
        {
            "firstname": "Claire",
            "lastname": "Brown",
            "username": "claire",
            "email": "claire@aa.io",
            "password": "password",
            "profile_url": "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            "account_balance": 950.0,
        },
    ]

    users = []
    for user_data in users_data:
        user = User(
            username=user_data["username"],
            firstname=user_data["firstname"],  
            lastname=user_data["lastname"], 
            email=user_data["email"],
            password=user_data["password"], 
            profile_url=user_data["profile_url"]
        )
        users.append(user)

    db.session.add_all(users)
    db.session.commit()

def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))
    db.session.commit()


