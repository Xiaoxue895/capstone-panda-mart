import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// Redux Imports
import { getProductByIdThunk, updateProductThunk, deleteProductThunk, addProductImageThunk, deleteProductImageThunk } from "../../redux/product";

function UpdateProductForm() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.session.user);
  const product = useSelector((state) => state.product.productDetails);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inventory, setInventory] = useState(0);
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [previewImage, setPreviewImage] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [image5, setImage5] = useState(null);
  const [errors, setErrors] = useState({});
  const [imagesLoading, setImagesLoading] = useState(false);

  useEffect(() => {
    dispatch(getProductByIdThunk(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setInventory(product.inventory);
      setPrice(product.price);
      setCategoryId(product.category_id);
      // Optionally set previous images
    }
  }, [product]);

  if (!user) return <Navigate to="/" replace={true} />;
  if (!product) return <div>Loading...</div>;

  const validateForm = () => {
    const errorObj = {};

    if (!name) errorObj.name = "Title is required.";
    if (!description) errorObj.description = "Description is required.";
    if (description.length < 10)
      errorObj.description =
        "Description must be at least 10 characters long. Please provide more details on your product.";
    if (inventory <= 0) errorObj.inventory = "Inventory must be at least 1.";
    if (price <= 0) errorObj.price = "Price must be greater than zero.";
    if (!categoryId) errorObj.category = "Category is required.";

    return errorObj;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (Object.values(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    const updated_product = {
      name,
      description,
      inventory: Number(inventory),
      price: Number(price),
      category_id: Number(categoryId),
      seller_id: user.id,
    };

    const result = await dispatch(updateProductThunk(productId, updated_product));
    if (result.errors) setErrors(result.errors);

    const imageArray = [
      { product_id: productId, image: previewImage, preview: true },
      image1 && { product_id: productId, image: image1, preview: false },
      image2 && { product_id: productId, image: image2, preview: false },
      image3 && { product_id: productId, image: image3, preview: false },
      image4 && { product_id: productId, image: image4, preview: false },
      image5 && { product_id: productId, image: image5, preview: false },
    ].filter(Boolean);

    setImagesLoading(true);
    try {
      await Promise.all(
        imageArray.map((image) => {
          const formData = new FormData();
          formData.append("product_id", image.product_id);
          formData.append("image", image.image);
          formData.append("preview", image.preview);
          return dispatch(addProductImageThunk(formData, user.id));
        })
      );
      setImagesLoading(false);
      navigate(`/products/${productId}`);
    } catch (e) {
      setImagesLoading(false);
      setErrors({ ...e.errors });
    }
  };

  const handleDeleteProduct = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this product?");
    if (confirmation) {
      await dispatch(deleteProductThunk(productId));
      navigate("/products");
    }
  };

  const handleDeleteImage = async (imageId) => {
    const confirmation = window.confirm("Are you sure you want to delete this image?");
    if (confirmation) {
      await dispatch(deleteProductImageThunk(imageId, productId));
      dispatch(getProductByIdThunk(productId)); // Refresh product details after deletion
    }
  };

  return (
    <main>
      <form method="POST" onSubmit={handleSubmit} className="product_form" encType="multipart/form-data">
        <div>
          <label><h3>Name</h3></label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>

        <div>
          <label><h3>Description</h3></label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>

        <div>
          <label><h3>Inventory</h3></label>
          <input
            type="number"
            min="1"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
          />
          {errors.inventory && <p className="error">{errors.inventory}</p>}
        </div>

        <div>
          <label><h3>Price</h3></label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        <div>
          <label><h3>Category</h3></label>
          <select
            name="category_id"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="0">Select a category</option>
            {/* Categories should match your backend */}
          </select>
          {errors.category && <p className="error">{errors.category}</p>}
        </div>

        <div>
          <label><h3>Preview Image</h3></label>
          <input
            type="file"
            onChange={(e) => setPreviewImage(e.target.files[0])}
            accept=".png, .jpg, .jpeg, .gif"
          />
          {previewImage && (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(previewImage)}
              alt="Preview"
            />
          )}
        </div>

        {/* Images input fields */}
        {[image1, image2, image3, image4, image5].map((image, index) => (
          <div key={index}>
            <label>Image {index + 1}</label>
            <input
              type="file"
              onChange={(e) => setImageState(index, e.target.files[0])} // Function to handle multiple image inputs
              accept=".png, .jpg, .jpeg, .gif"
            />
            {image && (
              <div>
                <img
                  className="previewImagesize"
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                />
                <button type="button" onClick={() => handleDeleteImage(image.id)}>
                  Delete Image {index + 1}
                </button>
              </div>
            )}
          </div>
        ))}

        <div>
          <button type="submit" disabled={imagesLoading}>
            {imagesLoading ? "Uploading images..." : "Update Product"}
          </button>
        </div>
      </form>

      <div>
        <button onClick={handleDeleteProduct}>Delete Product</button>
      </div>
    </main>
  );
}

export default UpdateProductForm;


