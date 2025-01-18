// get products; get products by current user; get products by userid
// get product search result; get product by category
// get product detail
// create a product, update a product, delete a product 
// add image , delete image
// all action types

// import { csrfFetch } from "./csrf";

const SHOW_PRODUCTS = "products/SHOW_PRODUCTS";
const SHOW_PRODUCTS_BY_USER = "products/SHOW_PRODUCTS_BY_USER";
const SHOW_PRODUCT_DETAILS = "products/SHOW_PRODUCT_DETAILS";
const SHOW_PRODUCT_SEARCH_RESULTS = "products/SHOW_PRODUCT_SEARCH_RESULTS";
const SHOW_PRODUCTS_BY_CATEGORY = "products/SHOW_PRODUCTS_BY_CATEGORY";
const CREATE_PRODUCT = "products/CREATE_PRODUCT";
const UPDATE_PRODUCT = "products/UPDATE_PRODUCT";
const DELETE_PRODUCT = "products/DELETE_PRODUCT";
const ADD_IMAGE = "products/ADD_IMAGE";
const DELETE_IMAGE = "products/DELETE_IMAGE";

// Action Creators
const showProducts = (products) => ({
  type: SHOW_PRODUCTS,
  products,
});

const showProductsByUser = (products) => ({
  type: SHOW_PRODUCTS_BY_USER,
  products,
});

const showProductDetails = (product) => ({
  type: SHOW_PRODUCT_DETAILS,
  product,
});

const showProductSearchResults = (results) => ({
  type: SHOW_PRODUCT_SEARCH_RESULTS,
  results,
});

const showProductsByCategory = (categoryData) => ({
  type: SHOW_PRODUCTS_BY_CATEGORY,
  categoryData,
});

const createProduct = (product) => ({
  type: CREATE_PRODUCT,
  product,
});

const updateProduct = (product) => ({
  type: UPDATE_PRODUCT,
  product,
});

const deleteProduct = (productId) => ({
  type: DELETE_PRODUCT,
  productId,
});

const addImage = (image,productId) => ({
  type: ADD_IMAGE,
  payload: image,productId
});

const deleteImage = (image) => ({
  type: DELETE_IMAGE,
  image,
});

// Thunks
export const showProductsThunk = () => async (dispatch) => {
  const response = await fetch("/api/products/");
  if (response.ok) {
    const data = await response.json();
    dispatch(showProducts(data.products));
  }
};

export const showProductsByCurrentThunk = () => async (dispatch) => {
  const response = await fetch("/api/products/user/current");
  if (response.ok) {
    const data = await response.json();
    dispatch(showProductsByUser(data.products));
  }
};

export const showProductsByUserThunk = (userId) => async (dispatch) => {
  const response = await fetch(`/api/products/user/${userId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(showProductsByUser(data.products));
  }
};

export const showProductDetailsThunk = (id) => async (dispatch) => {
  const response = await fetch(`/api/products/${id}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(showProductDetails(data));
  }
};

export const showSearchResultsThunk = (input) => async (dispatch) => {
  const response = await fetch(`/api/search/product?input=${input}`);
  if (response.ok) {
    const data = await response.json();
    // console.log(data)
    const resultsList = data[0]?.results_list || [];
    dispatch(showProductSearchResults(resultsList));
  }
};

export const showProductsByCategoryThunk = (categoryId) => async (dispatch) => {
  const response = await fetch(`/api/search/category/${categoryId}`);
  if (response.ok) {
    const data = await response.json();
    dispatch(showProductsByCategory(data));
  }
};

export const createProductThunk = (productData) => async (dispatch) => {
  const response = await fetch("/api/products/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (response.ok) {
    const result = await response.json();
    dispatch(createProduct(result));
    return result;
  }
};

export const updateProductThunk = (id, productData) => async (dispatch) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(productData),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(updateProduct(data));
  }
};

export const deleteProductThunk = (id) => async (dispatch) => {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });
  if (response.ok) {
    dispatch(deleteProduct(id));
  }
};


export const addProductImageThunk = (formData,productId) => async (dispatch) => {
  const response = await fetch(`/api/products/${productId}/images/new`, {
    method: "POST",
    // headers: { "Content-Type": "multipart/form-data" },
    body: formData,
  });

  if (response.ok) {
    const newImage = await response.json();
    dispatch(addImage(newImage));
    return newImage;
  } else {
    const error = await response.json();
    console.log('ERROR', error);
    throw error;
  }
};

export const deleteImageThunk = (image) => async (dispatch) => {
  const response = await fetch(`/api/products/${productId}/images/${imageId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteImage(image));
  } else {
    const error = await response.json();
    throw new Error(error.message);
  }
};

// Reducer
const initialState = { 
  allProducts: [], 
  userProducts: [], 
  productDetails: {}, 
  searchResults: [], 
  categoryProducts: [] 
};

const productReducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_PRODUCTS:
      return { ...state, allProducts: action.products };

    case SHOW_PRODUCTS_BY_USER:
      return { ...state, userProducts: action.products };

    case SHOW_PRODUCT_DETAILS:
      return { ...state, productDetails: action.product };

    case SHOW_PRODUCT_SEARCH_RESULTS:
      return { ...state, searchResults: action.results || [] };

    case SHOW_PRODUCTS_BY_CATEGORY:
      return { ...state, categoryProducts: action.categoryData.products };

    case CREATE_PRODUCT:
      return { ...state, allProducts: [...state.allProducts, action.product] };

    case UPDATE_PRODUCT:
      return { 
        ...state, 
        allProducts: state.allProducts.map((product) =>
          product.id === action.product.id ? action.product : product
        ) 
      };

    case DELETE_PRODUCT:
      return { 
        ...state, 
        allProducts: state.allProducts.filter((product) => product.id !== action.productId) 
      };

      case ADD_IMAGE: {
        const { product_id, ...imageData } = action.payload;
      
        return {
          ...state,
          productDetails: {
            ...state.productDetails,
            images: [...(state.productDetails.images || []), imageData],
          },
          allProducts: state.allProducts.map((product) =>
            product.id === product_id
              ? { ...product, images: [...(product.images || []), imageData] }
              : product
          ),
        };
      }

    case DELETE_IMAGE:
      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          images: (state.productDetails.images || []).filter(
            (image) => image.id !== action.image.id
          ),
        },
        allProducts: state.allProducts.map((product) =>
          product.id === action.image.productId
            ? {
                ...product,
                images: (product.images || []).filter((image) => image.id !== action.image.id),
              }
            : product
        ),
      };

    default:
      return state;
  }
};

export default productReducer;

