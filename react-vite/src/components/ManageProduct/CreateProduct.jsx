// React Imports
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

import {createProductThunk,addImageThunk} from "../../redux/product";

function CreateProductForm() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inventory, setInventory] = useState(0);
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [image1Url, setImage1Url] = useState("");
  const [image2Url, setImage2Url] = useState("");
  const [image3Url, setImage3Url] = useState("");
  const [image4Url, setImage4Url] = useState("");
  const [imagesLoading, setImagesLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const user = useSelector((state) => state.session.user);
  if (!user) return <Navigate to="/" replace={true} />;

  const validateForm = () => {
    const errorObj = {};

    // Validate title, description, inventory, price, and category
    if (!name) errorObj.title = "Name is required."
    if (!description) errorObj.description = "Description is required."
    if (description.length < 10) errorObj.description = "Description must be at least 10 characters long. Please provide more details on your product."
    if (inventory <= 0) errorObj.inventory = "Inventory must be at least 1. Please enter a positive value."
    if (price <= 0) errorObj.price = "Price must be greater than zero."
    if (!categoryId) errorObj.category = "Category is required."

    // Validate image URLs with a regex
    if (!previewImageUrl.type.match(/image\/\w*/)) {
      errorObj.previewImageUrl =
        "A valid image URL is required for the preview image.";
    }

    return errorObj;
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.values(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    const new_product = {
      name,
      description,
      inventory: Number(inventory),
      price: Number(price),
      category_id: Number(categoryId),
      seller_id: user.id,
    };

    // Dispatch addProduct action to add the new product
    const result = await dispatch(createProductThunk(new_product));
    if (result.errors) setErrors(result.errors);

    const productId = result.id;

    // Prepare an array of images to upload
    let imageArray = [
      {
        product_id: productId,
        url: previewImageUrl,
        preview: true,
      },
    ];

    // Add additional images if provided
    if (image1Url)
      imageArray.push({
        product_id: productId,
        url: image1Url,
        preview: false,
      });
    if (image2Url)
      imageArray.push({
        product_id: productId,
        url: image2Url,
        preview: false,
      });
    if (image3Url)
      imageArray.push({
        product_id: productId,
        url: image3Url,
        preview: false,
      });
    if (image4Url)
      imageArray.push({
        product_id: productId,
        url: image4Url,
        preview: false,
      });

    setImagesLoading(true)
    try {
      await Promise.all(
        imageArray.map((image) => {
          const formData = new FormData();
          formData.append('product_id', image.product_id);
          formData.append('image', image.url);
          formData.append('preview', image.preview);
          return dispatch(addImageThunk(formData, user.id))
        })
      );
      setImagesLoading(false)
    } catch (e) {
      console.log(e)
      setErrors(e.errors)
    }

    // Navigate to the new product page
    if (!Object.values(errors).length && !imagesLoading) {
      navigate(`/products/${productId}`);
    }
  };

  // Helper function to format the price input as a decimal
  const formatDecimal = (input) => {
    let value = parseFloat(input.value);
    if (!isNaN(value)) {
      input.value = value.toFixed(2);
    }
    return input.value;
  };

  return (
    <main>
      <form method="POST" onSubmit={handleSubmit} className="product_form" encType="multipart/form-data">
        <div>
          <label>
            <h3>Name</h3>
          </label>
          <p>Include keywords that buyers would use to search for this item.</p>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <p className="error">{errors.name}</p>}
        </div>
        <div>
          <label>
            <h3>Description</h3>
          </label>
          <p>
            Tell the world all about your item and why they will love it. Buyers
            will only see the first few lines unless they expand the
            description.
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <div>
          <label>
            <h3>Inventory</h3>
          </label>
          <p>
            Keep your product availability up-to-date to ensure customers know
            when your item is in stock.
          </p>
          <input
            type="number"
            min="1"
            step="1"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
            onBlur={(e) => {
              const formatted = parseInt(e.target.value);
              setInventory(formatted);
            }}
          />
          {errors.inventory && <p className="error">{errors.inventory}</p>}
        </div>
        <div>
          <label>
            <h3>Price</h3>
          </label>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <input
            type="number"
            value={price}
            onChange={(e) => {
              setPrice(e.target.value);
            }}
            step="0.01"
            onBlur={(e) => {
              const formatted = formatDecimal(e.target);
              setPrice(formatted);
            }}
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>
        <div>
          <label>
            <h3>Category</h3>
          </label>
          <p>
            Categorize your product accurately to help customers find it more
            easily.
          </p>
          <div className="select-container">
            <select
              name="category_id"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="0">Select a category</option>
              <option value="1">Electronics</option>
              <option value="2">Fashion</option>
              <option value="3">Home & Kitchen</option>
              <option value="4">Sports & Outdoors</option>
              <option value="5">Health & Beauty</option>
              <option value="6">Books</option>
              <option value="7">Toys & Games</option>
              <option value="8">Automotive</option>
              <option value="9">Groceries</option>
              <option value="10">Music & Movies</option>
            </select>
          </div>
          {errors.categoryId && <p className="error">{errors.categoryId}</p>}
        </div>
        <div>
          <label>
            <h3>Preview Image URL</h3>
          </label>
          <p>Submit at least one photo to publish your product.</p>
          <input
            type="file"
            onChange={(e) => setPreviewImageUrl(e.target.files[0])}
            accept=".pdf, .png, .jpg, .jpeg, .gif"
          />

          {previewImageUrl && previewImageUrl.type.match(/image\/\w*/) ? (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(previewImageUrl)}
              alt="Preview if Image is valid"

            />
          ) : null}
          {errors.previewImageUrl && (
            <p className="error">{errors.previewImageUrl}</p>
          )}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="file"
            onChange={(e) => setImage1Url(e.target.files[0])}
            accept=".pdf, .png, .jpg, .jpeg, .gif"
          />

          {image1Url ? (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image1Url)}
              alt="Preview if Image is valid"
            />
          ) : null}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="file"
            onChange={(e) => setImage2Url(e.target.files[0])}
            accept=".pdf, .png, .jpg, .jpeg, .gif"
          />

          {image2Url ? (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image2Url)}
              alt="Preview if Image is valid"
            />
          ) : null}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="file"
            onChange={(e) => setImage3Url(e.target.files[0])}
            accept=".pdf, .png, .jpg, .jpeg, .gif"
          />

          {image3Url ? (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image3Url)}
              alt="Preview if Image is valid"
            />
          ) : null}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="file"
            onChange={(e) => setImage4Url(e.target.files[0])}
            accept=".pdf, .png, .jpg, .jpeg, .gif"
          />

          {image4Url ? (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image4Url)}
              alt="Preview if Image is valid"
            />
          ) : null}
        </div>

        <button id="prod-form-submit" type="submit">{imagesLoading? "Loading" : "Publish Your Product"}</button>
      </form>
    </main>
  );
}

export default CreateProductForm;

