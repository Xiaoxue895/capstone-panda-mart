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
                    className={`heart-icon ${favorite.product? 'filled' : ''}`}
                    onClick={() => handleRemoveFavorite(favorite.favorite_id)}
                  >
                    ❤️
                  </div>
                  {favorite.product && favorite.product.preview_image && (
                    <img
                      src={
                        favorite.product.preview_image.startsWith('http')
                          ? favorite.product.preview_image
                          : `/${favorite.product.preview_image}`
                      }
                      alt={favorite.product.name}
                      className="product-preview"
                    />
                  )}
                  
                  <div className="product-details">
                    <h3>{favorite.product ? favorite.product.name : 'Unknown Product'}</h3>
                    <p>{favorite.product ? favorite.product.description : 'No description available'}</p>
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

