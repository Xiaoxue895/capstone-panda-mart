# e-commerce(need a beautiful name)

## Database Schema Design

## summary of document
1 USER AUTHENTICATION/AUTHORIZATION

1.1 All endpoints that require authentication
/auth
1.2 All endpoints that require proper authorization
/auth/unauthorized
1.3 Get all users
/user get
1.3.5 get user by id
/user/:id get
1.4 Log In a User
/auth/login post
1.5 Sign Up a User
/auth/signup post
1.6 Log Out a User
/auth/logout 
1.7 Update user information
/user/:id patch
1.8 Delete a user
/user/:id delete

2 PRODUCTS
2.1 Get all Products 
GET /products
2.2 Get all products by specific categroies
GET /products/categories/:category_id
2.2.2 Get all Products owned by the Current User
## GET /users/current/products
2.2.5 Get all Products owned by specific user id
## GET /users/:user_id/products
2.3 Get details of a Products from an id
GET /products/:product_id
2.4 Create a Products
POST /products
2.6 Edit Product by id
patch /products/:product_id
2.7 Delete Product by id
delete /products/:product_id


3 PRODUCT_CATEGROIES
3.1 Get all categroies
GET /products/categories
3.2 create new categroies
post /products/categories
3.3 delete categroies
delete /products/categories/:category_id

4 PRODUCT_IMAGES
3.1 add images for specific product
POST /products/:product_id/images
3.2 delete images for specific product
DELETE /products/:product_id/images/:image_id

5 FAVORITES
5.1 Get All Favorites for the Current User
GET /favorites
5.2 Add a Product to Favorites
post /favorites
5.3 Remove a Product from Favorites
delete /favorites/:favorite_id

6 CARTS （one user should just have only one cart）
6.1 Get the Current User's Cart
GET /cart
6.2 Add an Item to the Cart
POST /cart/items
6.3 Update an Item in the Cart（for gift）
patch /cart/items/:item_id
6.4 change the quantity we save in the cart（what is difference between 6.3-6.4）
PATCH /cart/items/:item_id
6.5 Delete all Item from the Cart
DELETE /cart/items
6.6 Delete specific Item from the Cart
DELETE /cart/items/:item_id

7 REVIEWS
7.1 Get All Reviews for a Product
## GET /products/:product_id/reviews
7.2 Get all reviews for the current user
## GET /users/:user_id/reviews
7.2 Add a Review for a Product
## POST /products/:product_id/reviews
7.3 Edit a Review
patch /reviews/:review_id
7.4 Delete a Review
DELETE /reviews/:review_id