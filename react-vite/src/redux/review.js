// show all review for one product; show stats for product; show specific review for current user and product
// create review ; update review ; delete review

// do we need stats of reviews? 
const SHOW_REVIEWS = 'reviews/SHOW_REVIEWS';
const SHOW_REVIEW_STATS = 'reviews/SHOW_REVIEW_STATS';
const SHOW_USER_REVIEW = 'reviews/SHOW_USER_REVIEW';
const CREATE_REVIEW = 'reviews/CREATE_REVIEW';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW';
const DELETE_REVIEW = 'reviews/DELETE_REVIEW';

// show reviews 
const showReviews = (reviews,productId) => ({
    type: SHOW_REVIEWS,
    payload: { reviews, productId }
  });
  
  // show review stats
  const showReviewStats = (stats,productId) => ({
    type: SHOW_REVIEW_STATS,
    payload: { stats, productId }
  });
  
  // show user review for product
  const showUserReview = (review) => ({
    type: SHOW_USER_REVIEW,
    payload: review
  });
  
  // Add new review 
  const createReview = (review) => ({
    type: CREATE_REVIEW,
    payload: review
  });
  
  // Update existing review 
  const updateReview = (review) => ({
    type: UPDATE_REVIEW,
    payload: review
  });
  
  // Delete review
  const deleteReview = (reviewId,productId) => ({
    type: DELETE_REVIEW,
    payload: { reviewId, productId }
  });


// Get all reviews for a product
export const thunkShowReviews = (productId) => async (dispatch) => {
    const response = await fetch(`/api/products/${productId}/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(showReviews(data,productId));  
    }
  };
  
  // 2. Get review stats (total stars, review count, average stars) for a product
  export const thunkGetReviewStats = (productId) => async (dispatch) => {
    const response = await fetch(`/api/products/${productId}/review-stats`);
    if (response.ok) {
      const data = await response.json();
      dispatch(showReviewStats(data,productId));  
    }
  };
  
  // 3. Get current user's review for a product
  export const thunkGetUserReviewForProduct = (productId) => async (dispatch) => {
    const response = await fetch(`/api/products/${productId}/current/reviews`);
    if (response.ok) {
      const data = await response.json();
      dispatch(showUserReview(data));  
    }
  };
  
  // 4. Create a new review for a product
  export const thunkCreateReview = (productId, reviewData) => async (dispatch) => {
    const response = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
  
    if (response.ok) {
      const data = await response.json();
      dispatch(createReview(data)); 
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return errorMessages;  
    } else {
      return { server: 'Something went wrong. Please try again' };  
    }
  };
  
  // 5. Update an existing review
  export const thunkUpdateReview = (reviewId, reviewData) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reviewData),
    });
  
    if (response.ok) {
      const data = await response.json();
      dispatch(updateReview(data)); 
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return errorMessages;  
    } else {
      return { server: 'Something went wrong. Please try again' };  
    }
  };
  
  // 6. Delete a review
  export const thunkDeleteReview = (reviewId,productId) => async (dispatch) => {
    const response = await fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  
    if (response.ok) {
      dispatch(deleteReview(reviewId,productId));  
    } else if (response.status < 500) {
      const errorMessages = await response.json();
      return errorMessages;  
    } else {
      return { server: 'Something went wrong. Please try again' };  
    }
  };

  const initialState = {
    reviews: [],
    reviewStats: {
      stars_total: 0,
      review_count: 0,
      average_stars: 0,
    },
    userReview: null,
    error: null,
  };
  
  const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
      case SHOW_REVIEWS:
        return { ...state, reviews: action.payload.reviews }; 
      case SHOW_REVIEW_STATS:
        return { ...state, reviewStats: action.payload.stats }; 
      case SHOW_USER_REVIEW:
        return { ...state, userReview: action.payload };
      case CREATE_REVIEW:
        return { ...state, reviews: [...state.reviews, action.payload] };
      case UPDATE_REVIEW:
        return {
          ...state,
          reviews: state.reviews.map((review) =>
            review.id === action.payload.id ? action.payload : review
          ),
        };
      case DELETE_REVIEW:
        return {
          ...state,
          reviews: state.reviews.filter((review) => review.id !== action.payload.reviewId), // 修复：正确使用 reviewId
        };
      case 'reviews/SET_ERROR':
        return { ...state, error: action.payload }; 
      default:
        return state;
    }
  };

 export default reviewReducer;
  