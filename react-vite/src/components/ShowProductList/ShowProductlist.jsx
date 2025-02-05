

import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { showProductsThunk } from "../../redux/product"; 
import SearchBar from "../SearchBar/SearchBar"; // for test
import SearchCategory from "../SearchCategory/SearchCategory"; // for test
import "./ShowProductList.css";

const ShowProductList = () => {
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);

  const products = useSelector((state) => state.products?.allProducts || []);

  useEffect(() => {
    const fetchProducts = async () => {
      await dispatch(showProductsThunk());
      setLoading(false); 
    };
    
    fetchProducts();
  }, [dispatch]);

  if (loading) {
    return (
      <main>
        <div className="center-in-page">
          <h2>Loading products...</h2>
        </div>
      </main>
    );
  }

  if (!products || products.length === 0) {
    return (
      <main>
        <div className="center-in-page">
          <h2>No products available. Please check back later.</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="prod-list">
      <SearchBar />
      <SearchCategory />
      <div className="grid_container">
        {products.map((product) => {
          const previewImage = product.images.find((image) => image.preview)?.image;
          const imageUrl =
            previewImage && typeof previewImage === "string" && previewImage.startsWith("http")
              ? previewImage 
              : previewImage
              ? `/${previewImage}` 
              : null;

          return (
            <div key={product.id} className="grid-item">
              <Link to={`/products/${product.id}`}>
                <div className="image_container">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image-placeholder">No Image</div>
                  )}
                </div>

                <div className="product-details-mainpage">
                  <p className="name">{product.name}</p>
                  <p className="category">
                    <strong>Category:</strong> {product.category_type}
                  </p>
                  <p className="seller">
                    <strong>Seller:</strong> {product.seller_username}
                  </p>
                  <p className="price">
                    <strong>Price:</strong> ${parseFloat(product.price).toFixed(2)}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default ShowProductList;


