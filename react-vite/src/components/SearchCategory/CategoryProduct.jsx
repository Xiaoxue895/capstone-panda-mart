import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { showProductsByCategoryThunk } from "../../redux/product"; 
import { Link } from "react-router-dom";
// import "./CategoryProduct.css";

const CategoryProductPage = () => {
  const { categoryId } = useParams(); 
  const dispatch = useDispatch();
  
  const categoryData = useSelector((state) => state.products.categoryProducts || []);

  useEffect(() => {
    dispatch(showProductsByCategoryThunk(categoryId)); 
  }, [categoryId, dispatch]);

  if (!categoryData || categoryData.length === 0) {
    return (
      <main>
        <div className="center-in-page">
          <h2>Loading products...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="category-products">
      <h1>Category Products</h1>
      <div className="product-list">
        {categoryData.map((product) => {
          // Get the preview image for the product
          const previewImage = product.images.find(image => image.preview)?.url;
          const imageUrl = previewImage ? `/${previewImage}` : undefined;
          
          return (
            <div key={product.id} className="product-item">
              <Link to={`/products/${product.id}`} className="product-link">
                <div className="image-container">
                  {previewImage ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      className="product-image"
                    />
                  ) : (
                    <div className="no-image">No Image</div>
                  )}
                </div>
                <div className="product-details">
                  <p className="product-name">{product.name}</p>
                  <p className="product-price">
                    ${parseFloat(product.price).toFixed(2)}
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

export default CategoryProductPage;
