import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  thunkShowReviews,
  thunkGetReviewStats,
  thunkDeleteReview,
  thunkCreateReview,
  thunkUpdateReview,
} from '../../redux/review';
import ReviewForm from './ReviewForm';

const ProductReviews = ({ productId }) => {
  const dispatch = useDispatch();

  const reviews = useSelector((state) => state.reviews?.reviews || []);
  const reviewStats = useSelector((state) => state.reviews?.reviewStats || {
    stars_total: 0,
    review_count: 0,
    average_stars: 0,
  });
  const userReview = useSelector((state) => state.reviews?.userReview || null);

  const [isEditing, setIsEditing] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  useEffect(() => {
    dispatch(thunkShowReviews(productId));
    dispatch(thunkGetReviewStats(productId));
  }, [dispatch, productId]);

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete your review?')) {
      await dispatch(thunkDeleteReview(reviewId, productId));
      dispatch(thunkGetReviewStats(productId)); 
    }
  };

  const handleEditReview = (review) => {
    setIsEditing(true);
    setReviewToEdit(review);
  };

  const handleReviewSubmit = async (reviewData) => {
    if (isEditing) {
      await dispatch(thunkUpdateReview(reviewToEdit.id, reviewData));
    } else {
      await dispatch(thunkCreateReview(productId, reviewData));
    }
    setIsEditing(false);
    setReviewToEdit(null);
    dispatch(thunkShowReviews(productId)); 
    dispatch(thunkGetReviewStats(productId)); 
  };

  return (
    <div>
      <h2>Product Reviews</h2>

      <div>
        <h3>Review Stats</h3>
        <p>Total Reviews: {reviewStats.review_count}</p>
        <p>Average Rating: {reviewStats.average_stars.toFixed(1)}</p>
        <p>Total Stars: {reviewStats.stars_total}</p>
      </div>

      <div>
        <h3>All Reviews</h3>
        {reviews.length === 0 ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="review-item">
              <div>
                <p><strong>Rating:</strong> {review.rating} / 5</p>
                <p><strong>Comment:</strong> {review.comment}</p>
                <p><strong>By:</strong> {review.user.username}</p>
              </div>

              {userReview && review.id === userReview.id && (
                <div>
                  <button onClick={() => handleEditReview(review)}>Edit Review</button>
                  <button onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div>
        <ReviewForm
          productId={productId}
          initialData={reviewToEdit}
          onSubmit={handleReviewSubmit}
        />
      </div>
    </div>
  );
};

export default ProductReviews;

