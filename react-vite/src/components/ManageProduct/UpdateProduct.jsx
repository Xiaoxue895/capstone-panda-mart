import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate, useParams } from "react-router-dom";

import {addProductImage,deleteProductImage,productById,editProduct,} from "../../redux/product";


function UpdateProductForm() {

  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // State hooks for managing form fields and error messages
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inventory, setInventory] = useState();
  const [price, setPrice] = useState();
  const [categoryId, setCategoryId] = useState();
  const [previewImage, setPreviewImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");

  const [imagesLoading, setImagesLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Get user and product details from Redux store
  const user = useSelector((state) => state.session.user);
  const product = useSelector((state) => state.products.productById?.[productId]);

  // Orders images so preview is at top of list
  const images = [];
  if (product?.product_images) {
    const imgA = Object.values(product.product_images);
    imgA.forEach((img) => {
      if (img.preview) {
        images.unshift(img);
      } else {
        images.push(img);
      }
    });
  }

  // useEffect to load product data if not already available
  useEffect(() => {
    if (!product) {
      dispatch(productById(productId));
    } else {
      // Initialize form fields with existing product data
      setName(product.title || "");
      setDescription(product.description || "");
      setInventory(product.inventory || "");
      setPrice(product.price.toFixed(2) || "");
      setCategoryId(product.category_id || "");
    }
  }, [dispatch, productId, product]);

  // useEffect to initialize image state variables
  useEffect(() => {
    if (!previewImage) {
      setPreviewImage(images[0] || "");
      setImage1(images[1] || "");
      setImage2(images[2] || "");
      setImage3(images[3] || "");
      setImage4(images[4] || "");
    }
  }, [images, previewImage]);

  if (!user) return <Navigate to="/" replace={true} />;

  // Function to validate form inputs
  const validateForm = () => {
    const errorObj = {};

    if (!title) errorObj.title = "Title is required.";
    if (!description) errorObj.description = "Description is required.";
    if (description.length < 10)
      errorObj.description =
        "Description must be at least 10 characters long. Please provide more details on your product.";
    if (inventory <= 0)
      errorObj.inventory =
        "Inventory must be at least 1. Please enter a positive value.";
    if (price <= 0) errorObj.price = "Price must be greater than zero.";
    if (!categoryId) errorObj.category = "Category is required.";
    return errorObj;
  };

  const imagesDelete = [];
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form and show errors if necessary
    const formErrors = validateForm();
    if (Object.values(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});

    // Prepare the updated product data
    const updated_product = {
      id: product.id,
      name,
      description,
      inventory: Number(inventory),
      price: Number(price),
      category_id: Number(categoryId),
      seller_id: user.id,
    };

    // Prepare arrays to manage image updates
    const imagesUpdate = previewImage.file? [previewImage] : [];
    const imagesAdd = [];

    // Check if image URLs are present and determine if they should be updated, deleted, or added
    if (image1.file && images[1]) {
      imagesUpdate.push(image1);
    } else if (!image1.url && images[1]) {
      imagesDelete.push(image1);
    } else if (image1.url && !images[1]) {
      imagesAdd.push(image1);
    }

    if (image2.file && images[2]) {
      imagesUpdate.push(image2);
    } else if (!image2.url && images[2]) {
      imagesDelete.push(image2);
    } else if (image2.url && !images[2]) {
      imagesAdd.push(image2);
    }

    if (image3.file && images[3]) {
      imagesUpdate.push(image3);
    } else if (!image3.url && images[3]) {
      imagesDelete.push(image3);
    } else if (image3.url && !images[3]) {
      imagesAdd.push(image3);
    }

    if (image4.file && images[4]) {
      imagesUpdate.push(image4);
    } else if (!image4.url && images[4]) {
      imagesDelete.push(image4);
    } else if (image4.url && !images[4]) {
      imagesAdd.push(image4);
    }

    // Dispatch the editProduct action and handle image updates
    const res = await dispatch(editProduct(updated_product))
    if (res.errors) setErrors(res.errors)

    setImagesLoading(true)
    try {
        await Promise.all(imagesAdd.map(async (image) => {
          const formData = new FormData();
          formData.append('product_id', res.id);
          formData.append('image', image.file);
          formData.append('preview', false);
          return dispatch(addProductImage(formData, user.id));
        }));

        // Delete images that have been removed
        await Promise.all(imagesDelete.map(async (image) => {
          return dispatch(deleteProductImage(image));
        }));
      } catch (e) {
        setErrors(e)
        console.log(errors)
      }
      setImagesLoading(false)

    // Navigate to the new product page
    if (!Object.values(errors).length && !imagesLoading) {
      navigate(`/products/${res.id}`);
    }

  };

  // Helper function to format price input as a decimal
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
            Tell the world all about your item and why they’ll love it. Buyers
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
            onChange={(e) => setPrice(e.target.value)}
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
            onChange={(e) =>
              setPreviewImage({ ...previewImage, url: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })
            }
            type="file"
            accept=".pdf, .png, .jpg, .jpeg, .gif"
          />
          {previewImage.url ? (
            <>
            <img
              className="previewImagesize"
              src={previewImage.url}
              alt="Preview if Image is valid"
            />
            <button className="del-img" onClick={() => {imagesDelete.push(previewImage); setPreviewImage({...previewImage, url: ''})}}>Delete</button>
            </>

          ) : null}

        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="file"
            accept=".pdf, .png, .jpg, .jpeg, .gif"
            onChange={(e) => setImage1({ ...image1, file: e.target.files[0], url: URL.createObjectURL(e.target.files[0])})}
          />
          {image1.url ? (
            <>
            <img
              className="previewImagesize"
              src={image1.url}
              alt="Preview if Image is valid"
            />
            <button className="del-img" onClick={() => {imagesDelete.push(image1); setImage1({...image1, url: ''})}}>Delete</button>
            </>
          ) : null}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="file"
            accept=".pdf, .png, .jpg, .jpeg, .gif"
            onChange={(e) => setImage2({ ...image2, url: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })}
          />
          {image2.url ? (
            <>
            <img
              className="previewImagesize"
              src={image2.url}
              alt="Preview if Image is valid"
            />
            <button className="del-img" onClick={() => {imagesDelete.push(image2); setImage2({...image2, url: ''})}}>Delete</button>
            </>
          ) : null}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="file"
            accept=".pdf, .png, .jpg, .jpeg, .gif"
            onChange={(e) => setImage3({ ...image3, url: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })}
          />
          {image3.url ? (
            <>
            <img
              className="previewImagesize"
              src={image3.url}
              alt="Preview if Image is valid"
            />
            <button className="del-img" onClick={() => {imagesDelete.push(image3); setImage3({...image3, url: ''})}}>Delete</button>

            </>
          ) : null}
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="file"
            accept=".pdf, .png, .jpg, .jpeg, .gif"
            onChange={(e) => setImage4({ ...image4, url: URL.createObjectURL(e.target.files[0]), file: e.target.files[0] })}
          />
          {image4.url ? (
            <>
            <img
              className="previewImagesize"
              src={image4.url}
              alt="Preview if Image is valid"
            />
            <button className="del-img" onClick={() => {imagesDelete.push(image4); setImage4({...image4, url: ''})}}>Delete</button>
            </>
          ) : null}
        </div>
        <button id="prod-form-submit" type="submit">{imagesLoading? "Loading" : "Update Your Product"}</button>
      </form>
    </main>
  );
}

export default UpdateProductForm;

