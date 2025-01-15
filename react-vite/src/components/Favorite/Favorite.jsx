import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkShowFavorites, thunkRemoveFavorite, thunkClearFavorites } from '../../redux/favorite';
import'./Favorite.css'

const Favorites = () => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorite.favorites || []);


  useEffect(() => {
    dispatch(thunkShowFavorites());
  }, [dispatch]);


  const handleRemoveFavorite = (favoriteId) => {
    dispatch(thunkRemoveFavorite(favoriteId));
  };


  const handleClearFavorites = () => {
    dispatch(thunkClearFavorites());
  };

  return (
    <div className="favorites-container">
      <h1>Your Favorites</h1>

      {favorites.length === 0 ? (
        <p>No favorites found. Add some products to your favorites!</p>
      ) : (
        <>
          <button onClick={handleClearFavorites} className="clear-all-button">
            Clear All Favorites
          </button>
          <div className="favorites-list">
            {favorites.map(favorite => (
              <div key={favorite.favorite_id} className="favorite-item">
                <div className="favorite-product">
                  <div 
                    className={`heart-icon ${favorite.product.is_favorite ? 'filled' : ''}`}
                    onClick={() => handleRemoveFavorite(favorite.favorite_id)}
                  >
                    ❤️
                  </div>
                  <img
                    src={favorite.product.preview_image || 'default-image-url.jpg'}
                    alt={favorite.product.name}
                    className="product-preview"
                  />
                  <div className="product-details">
                    <h3>{favorite.product.name}</h3>
                    <p>{favorite.product.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Favorites;

