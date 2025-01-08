from flask.cli import AppGroup
from .users import seed_users, undo_users
from .cartitems import seed_cart_items,undo_cart_items
from .carts import seed_cart,undo_cart
from .categories import seed_categories,undo_categories
from .favorites import seed_favorites,undo_favorites
from .productimages import seed_product_images,undo_product_images
from .reviews import seed_reviews,undo_reviews
from .products import seed_products,undo_products
from app.models.db import db, environment, SCHEMA

# Creates a seed group to hold our commands
# So we can type `flask seed --help`
seed_commands = AppGroup('seed')


# Creates the `flask seed all` command
@seed_commands.command('all')
def seed():
    if environment == 'production':
        # Before seeding in production, you want to run the seed undo 
        # command, which will  truncate all tables prefixed with 
        # the schema name (see comment in users.py undo_users function).
        # Make sure to add all your other model's undo functions below
        undo_users()
        undo_cart_items()
        undo_cart()
        undo_categories()
        undo_favorites()
        undo_product_images()
        undo_reviews()
        undo_products()
    
    # Seeding data for each model
    seed_users()
    seed_categories()
    seed_products()
    seed_product_images()
    seed_reviews()
    seed_favorites()
    seed_cart()
    seed_cart_items()


# Creates the `flask seed undo` command
@seed_commands.command('undo')
def undo():
    undo_users()
    undo_cart_items()
    undo_cart()
    undo_favorites()
    undo_reviews()
    undo_product_images()
    undo_products()
    undo_categories()
    undo_users()
    # Add other undo functions here
