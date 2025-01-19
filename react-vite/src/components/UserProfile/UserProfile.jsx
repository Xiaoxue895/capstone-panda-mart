import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import './UserProfile.css'
import { useModal } from '../../context/Modal'

// Redux Imports
import { showProductsByUserThunk, deleteProductThunk } from "../../redux/product";

function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { setModalContent, closeModal } = useModal();

  const user = useSelector((state) => state.session.user);
  const userProducts = useSelector((state) => state.products.userProducts || []);

  useEffect(() => {
    if (user) {
      dispatch(showProductsByUserThunk(user.id));
    }
  }, [dispatch, user]);

  const handleUpdate = (productId) => {
    navigate(`/products/${productId}/update`);
  };

  const handleDelete = (productId) => {
    setModalContent(
      <div>
        <p>Are you sure you want to delete this product?</p>
        <button
          onClick={async () => {
            await dispatch(deleteProductThunk(productId));
            dispatch(showProductsByUserThunk(user.id)); // Refresh the product list after deletion
            closeModal(); 
          }}
        >
          Yes, delete it
        </button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    );
  };

  if (!user) return <div>Please log in to view your profile.</div>;

  return (
    <main className="user-profile">
      {/* User Information Section */}
      <section className="user-info">
        <h2>{user.firstname} {user.lastname}</h2>
        <p>{user.email}</p>
        <div className="user-navigation">
          <Link to="/cart" className="nav-button">See My Cart</Link>
          <Link to="/favorites" className="nav-button">See My Favorites</Link>
        </div>
      </section>

      {/* User Products Section */}
      <section className="user-products">
        <h3>Your Products</h3>
        {userProducts.length === 0 ? (
          <p>You have no products. Start adding some!</p>
        ) : (
          <div className="grid-container">
            {userProducts.map((product) => (
              <div key={product.id} className="product-item">
                <Link to={`/products/${product.id}`}>
                  <div className="image-container">
                    {product.images?.length > 0 ? (
                      <img
                        src={
                          // Check if the preview image is an AWS URL or a local image path
                          product.images.find((image) => image.preview)?.image?.startsWith("http")
                            ? product.images.find((image) => image.preview)?.image // AWS URL
                            : `/${product.images.find((image) => image.preview)?.image}` // Local image
                        }
                        alt={product.name}
                        className="product-image"
                      />
                    ) : (
                      <div className="no-image-placeholder">No Image</div>
                    )}
                  </div>
                </Link>
                <div className="manage-product-details">
                  <h4>{product.name}</h4>
                  <p>{product.description}</p>
                  <p>Price: ${parseFloat(product.price).toFixed(2)}</p>
                  <p>Inventory: {product.inventory}</p>
                  <div className="product-actions">
                    <button onClick={() => handleUpdate(product.id)}>Update</button>
                    <button onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default UserProfile;


