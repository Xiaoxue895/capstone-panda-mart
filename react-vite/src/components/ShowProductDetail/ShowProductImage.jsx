import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { showProductDetailsThunk } from "../../redux/product";
import "./ShowProductImage.css";

const ProductImage = ({ productId }) => {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.products.productDetails || {});

  useEffect(() => {
    dispatch(showProductDetailsThunk(productId));
  }, [dispatch, productId]);

  if (!product || Object.keys(product).length === 0)
    return <p>Loading product images...</p>;

  if (!product.images || product.images.length === 0)
    return <p>No images available for this product.</p>;

  const mainImage = product.images.find((image) => image.preview === true);
  const smallImages = product.images.filter((image) => image.preview === false);

  // Helper function to determine the image URL
  const getImageUrl = (imagePath) => {
    if (typeof imagePath === "string" && imagePath.startsWith("http")) {
      // Image is hosted on AWS or another remote service
      return imagePath;
    }
    // Image is stored locally
    return `/${imagePath}`;
  };

  return (
    <div className="product-image-container">
      <div className="main-image">
        {mainImage ? (
          <img
            src={getImageUrl(mainImage.image)}
            alt={`Main preview of ${product.name}`}
          />
        ) : (
          <img src="/images/default-preview.jpg" alt="Default preview" />
        )}
      </div>

      <div className="small-images">
        {smallImages.map((image) => (
          <div key={image.id} className="small-image">
            <img src={getImageUrl(image.image)} alt={`Thumbnail ${image.id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImage;

