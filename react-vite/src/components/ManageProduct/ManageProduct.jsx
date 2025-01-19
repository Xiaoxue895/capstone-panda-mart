import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// Redux Imports
import { showProductDetailsThunk, updateProductThunk, deleteProductThunk } from "../../redux/product";

function UpdateProductForm() {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.session.user);
  // const product = useSelector((state) => state.product.productDetails);
  const product = useSelector((state) => state.products.productDetails || {});

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [inventory, setInventory] = useState(0);
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    dispatch(showProductDetailsThunk(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setInventory(product.inventory);
      setPrice(product.price);
      setCategoryId(product.category_id);
    }
  }, [product]);

  if (!user) return <Navigate to="/" replace={true} />;
  if (!product) return <div>Loading...</div>;

  const validateForm = () => {
    const errorObj = {};

    if (!name) errorObj.name = "Name is required.";
    if (!description) errorObj.description = "Description is required.";
    if (description.length < 10)
      errorObj.description = "Description must be at least 10 characters long.";
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
    const updatedProduct = {
      name,
      description,
      inventory: Number(inventory),
      price: Number(price),
      category_id: Number(categoryId),
      seller_id: user.id,
    };

    // const result = await dispatch(updateProductThunk(productId, updatedProduct));
    // if (result.errors) {
    //   setErrors(result.errors);
    // } else {
    //   navigate(`/products/${productId}`);
    // }

    try {
      const result = await dispatch(updateProductThunk(productId, updatedProduct));
      console.log("Update result:", result);
      if (result.errors) {
        setErrors(result.errors);
        console.error("Update errors:", result.errors);
      } else {
        console.log("Update successful. Navigating to product details.");
        navigate(`/products/${productId}`);
      }
    } catch (error) {
      console.error("Unexpected error during update:", error);
    }
  };

  const handleDeleteProduct = async () => {
    const confirmation = window.confirm("Are you sure you want to delete this product?");
    if (confirmation) {
      await dispatch(deleteProductThunk(productId));
      navigate("/products");
    }
  };

  const handleCreateProduct = () => {
    navigate("/products/create");
  };

  return (
    <main>
      <div>Manage your products here</div>

      <div>
          <button onClick={handleCreateProduct}>Create New Product</button>
      </div>

      <div>Update your product here</div>

      <form method="POST" onSubmit={handleSubmit} className="product_form">
        <div>
          <label>
            <h3>Name</h3>
          </label>
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
          <input
            type="number"
            min="1"
            value={inventory}
            onChange={(e) => setInventory(e.target.value)}
          />
          {errors.inventory && <p className="error">{errors.inventory}</p>}
        </div>

        <div>
          <label>
            <h3>Price</h3>
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            step="0.01"
          />
          {errors.price && <p className="error">{errors.price}</p>}
        </div>

        <div>
          <label>
            <h3>Category</h3>
          </label>
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
          <button type="submit">Update Product</button>
        </div>
      </form>

      {/* <div>
        <button onClick={handleDeleteProduct}>Delete Product</button>
      </div> */}

    </main>
  );
}

export default UpdateProductForm;


