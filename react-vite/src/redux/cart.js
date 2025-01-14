// show items in cart; add one thing to cart ;remove one thing from cart
// edit quantity in cart(update)； clear cart

// if product deleted,what will happen?

// Action Types
const SHOW_CART = 'cart/SHOW_CART';
const ADD_TO_CART = 'cart/ADD_TO_CART';
const REMOVE_FROM_CART = 'cart/REMOVE_FROM_CART';
const CLEAR_CART = 'cart/CLEAR_CART';
const UPDATE_ITEM_QUANTITY = 'cart/UPDATE_ITEM_QUANTITY';

// Action Creators
const showCart = (cartItems) => ({
  type: SHOW_CART,
  payload: cartItems
});

const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product
});

const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId
});

const clearCart = () => ({
  type: CLEAR_CART
});

const updateItemQuantity = (product) => ({
  type: UPDATE_ITEM_QUANTITY,
  payload: product
});

// Thunks
export const thunkShowCart = () => async (dispatch) => {
  const response = await fetch('/api/cart/');
  if (response.ok) {
    const data = await response.json();
    dispatch(showCart(data.cart_items)); 
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

export const thunkAddToCart = (productData) => async (dispatch) => {
  const response = await fetch('/api/cart/product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addToCart(data)); 
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

export const thunkRemoveFromCart = (productId) => async (dispatch) => {
  const response = await fetch(`/api/cart/product/${productId}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(removeFromCart(productId)); 
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

export const thunkClearCart = () => async (dispatch) => {
  const response = await fetch('/api/cart/product', {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(clearCart());
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

export const thunkUpdateItemQuantity = (productId, quantity) => async (dispatch) => {
  const response = await fetch(`/api/cart/product/${productId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateItemQuantity(data)); 
  } else {
    const errorMessages = await response.json();
    return errorMessages;
  }
};

// Initial State
const initialState = { cart_items: [] }; 

// Reducer
function cartReducer(state = initialState, action) {
  switch (action.type) {
    case SHOW_CART:
      return { ...state, cart_items: action.payload }; 
    case ADD_TO_CART: {
      const existingItem = state.cart_items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart_items: state.cart_items.map(item =>
            item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
          )
        };
      }
      return { ...state, cart_items: [...state.cart_items, action.payload] };
    }
    case REMOVE_FROM_CART:
      return { ...state, cart_items: state.cart_items.filter(item => item.id !== action.payload) }; // 删除购物车商品
    case CLEAR_CART:
      return { ...state, cart_items: [] }; 
    case UPDATE_ITEM_QUANTITY:
      return {
        ...state,
        cart_items: state.cart_items.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    default:
      return state;
  }
}

export default cartReducer;

