// show favorite; add one thing to favorite; remove one thing from favorite
// remove all thing from favorite
// if product deleted,what will happen?
// Action Types

const SHOW_FAVORITES = 'favorites/SHOW_FAVORITES';
const ADD_FAVORITE = 'favorites/ADD_FAVORITE';
const REMOVE_FAVORITE = 'favorites/REMOVE_FAVORITE';
const CLEAR_FAVORITES = 'favorites/CLEAR_FAVORITES';

// Action Creators
const showFavorites = (favorites) => ({
  type: SHOW_FAVORITES,
  payload: favorites
});

const addFavorite = (favorite) => ({
  type: ADD_FAVORITE,
  payload: favorite
});

const removeFavorite = (favoriteId) => ({
  type: REMOVE_FAVORITE,
  payload: favoriteId
});

const clearFavorites = () => ({
  type: CLEAR_FAVORITES
});

// 1. Get all favorites for the current user
export const thunkShowFavorites = () => async (dispatch) => {
  const response = await fetch('/api/favorites/');
  if (response.ok) {
    const data = await response.json();
    dispatch(showFavorites(data));
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

// 2. Add a product to favorites
export const thunkAddFavorite = (productId) => async (dispatch) => {
  const response = await fetch('/api/favorites/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addFavorite(data));
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

// 3. Remove a product from favorites
export const thunkRemoveFavorite = (favoriteId) => async (dispatch) => {
  const response = await fetch(`/api/favorites/${favoriteId}`, {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(removeFavorite(favoriteId));
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

// 4. Clear all favorites for the current user
export const thunkClearFavorites = () => async (dispatch) => {
  const response = await fetch('/api/favorites/clear', {
    method: 'DELETE',
  });

  if (response.ok) {
    dispatch(clearFavorites());
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

// Reducer

const initialState = {
  favorites: [],
  error: null,
};

const favoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_FAVORITES:
      return { ...state, favorites: action.payload };
    case ADD_FAVORITE:
      return { ...state, favorites: [...state.favorites, action.payload] };
    case REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter(favorite => favorite.favorite_id !== action.payload),
      };
    case CLEAR_FAVORITES:
      return { ...state, favorites: [] };
    default:
      return state;
  }
};

export default favoriteReducer;
