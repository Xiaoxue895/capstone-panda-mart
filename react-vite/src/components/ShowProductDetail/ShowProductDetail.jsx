// in this page  people can see product detail
// add product to cart
// add product to favorite
// see the review stats  （all action about review in show review component)
// see all the reviews
// add new review 
// update new review
// delete review

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import {showProductDetailsThunk} from "../../redux/product";
import {thunkAddFavorite} from "../../redux/favorite";
import {thunkAddToCart} from "../../redux/cart"

// import ShowReview from "../Review/ShowReview";
import "./ShowProductDetail.css";

function ShowProductDetails() {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const product = useSelector((state) => state.products.productDetails || {});
    const [quantity, setQuantity] = useState(1);
    const [gift, setGift] = useState(false); 
  
    useEffect(() => {
      dispatch(showProductDetailsThunk(productId));
    }, [dispatch, productId]);
  
    const handleAddToCart = () => {
      if (quantity <= 0) {
        alert("Quantity must be greater than 0");
        return;
      }
      dispatch(thunkAddToCart({ product_id: productId, quantity, gift}))
        .then(() => alert("Product added to cart successfully!"))
        .catch((err) => alert(err.message || "Failed to add to cart."));
    };
  
    const handleAddToFavorite = () => {
      dispatch(thunkAddFavorite(productId))
        .then(() => alert("Product added to favorites!"))
        .catch((err) => alert(err.message || "Failed to add to favorites."));
    };
  
    if (!product || Object.keys(product).length === 0) {
        return <p>Loading product details...</p>;
      }
  
    return (
      <div className="product-details-container">
        <div className="product-info">
          <h1>{product.name}</h1>
          <p>{product.description}</p>
          <p>
            <strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}
          </p>
          <p>
            <strong>Category:</strong> {product.category_type}
          </p>
          <p>
            <strong>Inventory:</strong> {product.inventory > 0 ? `${product.inventory} available` : "Out of stock"}
          </p>
          <p>
            <strong>Seller:</strong> {product.seller_username}
          </p>
  
          <div className="product-images">
            {product.images.map((image) => (
              <img
                key={image.id}
                src={`/${image.url}`}
                alt={`Product Image ${image.id}`}
                className={image.preview ? "preview-image" : "thumbnail-image"}
              />
            ))}
          </div>
  
          <div className="cart-controls">
            <label>
              Quantity:
              <input
                type="number"
                min="1"
                max={product.inventory}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </label>
            <div className="gift-option">
            <label>
              Is this a gift?
              <input 
                type="checkbox" 
                checked={gift} 
                onChange={() => setGift(prev => !prev)} 
              />
            </label>
            </div>
            <button onClick={handleAddToCart} disabled={product.inventory <= 0}>
              Add to Cart
            </button>
          </div>
  
          <button onClick={handleAddToFavorite}>Add to Favorites</button>
        </div>
  
        {/* <div className="product-reviews">
          <ShowReview productId={productId} />
        </div> */}
      </div>
    );
  }
  
  export default ShowProductDetails;