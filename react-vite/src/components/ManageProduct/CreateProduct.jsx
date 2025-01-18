import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

// Redux Imports
import { createProductThunk, addProductImageThunk } from "../../redux/product";

function CreateProductForm() {
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
  const [imagesLoading, setImagesLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.session.user);
  if (!user) return <Navigate to="/" replace={true} />;

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

    const new_product = {
      name,
      description,
      inventory: Number(inventory),
      price: Number(price),
      category_id: Number(categoryId),
      seller_id: user.id,
    };

    const result = await dispatch(createProductThunk(new_product));
    console.log(result)
    if (result.errors) setErrors(result.errors);

    const productId = result.id;

    let imageArray = [
      { product_id: productId, image: previewImage, preview: true },
    ];

    if (image1) imageArray.push({ product_id: productId, image: image1, preview: false });
    if (image2) imageArray.push({ product_id: productId, image: image2, preview: false });
    if (image3) imageArray.push({ product_id: productId, image: image3, preview: false });
    if (image4) imageArray.push({ product_id: productId, image: image4, preview: false });
    if (image5) imageArray.push({ product_id: productId, image: image5, preview: false });

    setImagesLoading(true);
    try {
      await Promise.all(
        imageArray.map((image) => {
          const formData = new FormData();
          formData.append('product_id', image.product_id);
          console.log(image.image); 
          formData.append('image', image.image); // Ensure you're appending the file object
          formData.append('preview', image.preview);

          for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
          }
          return dispatch(addProductImageThunk(formData, user.id));
          
        })
      );
      setImagesLoading(false);
    } catch (e) {
      setImagesLoading(false);
      setErrors({ ...e.errors });
    }

    if (!Object.values(errors).length && !imagesLoading) {
      // setImagesLoading(false);
      navigate(`/products/${productId}`);
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
            step="1"
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

        <div>
          <label>Image 1</label>
          <input
            type="file"
            onChange={(e) => setImage1(e.target.files[0])} // Save file object
            accept=".png, .jpg, .jpeg, .gif"
          />
          {image1 && (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image1)}
              alt="Preview"
            />
          )}
        </div>

        <div>
          <label>Image 2</label>
          <input
            type="file"
            onChange={(e) => setImage2(e.target.files[0])} // Save file object
            accept=".png, .jpg, .jpeg, .gif"
          />
          {image2 && (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image2)}
              alt="Preview"
            />
          )}
        </div>

        <div>
          <label>Image 3</label>
          <input
            type="file"
            onChange={(e) => setImage3(e.target.files[0])} // Save file object
            accept=".png, .jpg, .jpeg, .gif"
          />
          {image3 && (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image3)}
              alt="Preview"
            />
          )}
        </div>

        <div>
          <label>Image 4</label>
          <input
            type="file"
            onChange={(e) => setImage4(e.target.files[0])} // Save file object
            accept=".png, .jpg, .jpeg, .gif"
          />
          {image4 && (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image4)}
              alt="Preview"
            />
          )}
        </div>

        <div>
          <label>Image 5</label>
          <input
            type="file"
            onChange={(e) => setImage5(e.target.files[0])} // Save file object
            accept=".png, .jpg, .jpeg, .gif"
          />
          {image5 && (
            <img
              className="previewImagesize"
              src={URL.createObjectURL(image5)}
              alt="Preview"
            />
          )}
        </div>

        <div>
          <button type="submit" disabled={imagesLoading}>
            {imagesLoading ? "Uploading images..." : "Create Product"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default CreateProductForm;




