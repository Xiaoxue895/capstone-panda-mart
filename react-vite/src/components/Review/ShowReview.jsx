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
import { useModal } from '../../context/Modal';
import "./ShowReview.css";

const ProductReviews = ({ productId }) => {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal(); 

  const reviews = useSelector((state) => {
    const reviewsData = state.review?.reviews;
    if (reviewsData && Array.isArray(reviewsData)) {
      return reviewsData;
    }
    return [];
  });

  const reviewStats = useSelector((state) => state.review?.reviewStats || {
    stars_total: 0,
    review_count: 0,
    average_stars: 0,
  });

  const sessionUser = useSelector((state) => state.session?.user);

  const [isEditing, setIsEditing] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);

  useEffect(() => {
    dispatch(thunkShowReviews(productId));
    dispatch(thunkGetReviewStats(productId));
  }, [dispatch, productId]);

  const handleDeleteReview = async (reviewId) => {
    setModalContent(
      <div>
        <p>Are you sure you want to delete your review?</p>
        <button
          onClick={async () => {
            await dispatch(thunkDeleteReview(reviewId, productId));
            dispatch(thunkGetReviewStats(productId)); 
            closeModal(); 
          }}
        >
          Yes, Delete
        </button>
        <button onClick={closeModal}>Cancel</button>
      </div>
    );
  };

  const handleEditReview = (review) => {
    setReviewToEdit(review);
    setIsEditing(true);
    setModalContent(
      <ReviewForm
        initialData={review}
        onSubmit={async (reviewData) => {
          await dispatch(thunkUpdateReview(review.id, reviewData));
          dispatch(thunkShowReviews(productId)); 
          dispatch(thunkGetReviewStats(productId)); 
          closeModal(); 
        }}
      />
    );
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
    <div className='review-bar'>
      <h2>Product Reviews</h2>

      <div>
      <h3>Review Stats</h3>
      <p>Total Reviews: {reviewStats.review_count}</p>
      <p>Average Rating: {(typeof reviewStats.average_stars === 'number' ? reviewStats.average_stars : 0).toFixed(1)}</p>
    </div>

      <div>
        <h3>Your Review</h3>
        {reviews.some((review) => review.user_id === sessionUser?.id) ? (
          reviews
            .filter((review) => review.user_id === sessionUser.id)
            .map((review) => (
              <div key={review.id} className="review-item">
                <p><strong>Stars:</strong> {review.stars} / 5</p>
                <p><strong>Review:</strong> {review.review}</p>
                <p><strong>Recommended:</strong> {review.recommendation ? 'Yes' : 'No'}</p>
                <button onClick={() => handleEditReview(review)}>Edit Review</button>
                <button onClick={() => handleDeleteReview(review.id)}>Delete Review</button>
              </div>
            ))
        ) : (
          <p>You haven&apos;t reviewed this product yet. Submit your review below!</p>
        )}
      </div>

      <div>
        <h3>Other Reviews</h3>
        {reviews.length === 0 || reviews.every((review) => review.user_id === sessionUser?.id) ? (
          <p>No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews
            .filter((review) => review.user_id !== sessionUser?.id)
            .map((review) => (
              <div key={review.id} className="review-item">
                <div>
                  <p><strong>Stars:</strong> {review.stars} / 5</p>
                  <p><strong>Review:</strong> {review.review}</p>
                  <p><strong>Recommended:</strong> {review.recommendation ? 'Yes' : 'No'}</p>
                  <p><strong>By:</strong> {review.user_name || 'Anonymous'}</p>
                </div>
              </div>
            ))
        )}
      </div>

      <div>
        <ReviewForm
          productId={productId}
          initialData={reviewToEdit || {}}
          onSubmit={handleReviewSubmit}
        />
      </div>
    </div>
  );
};

export default ProductReviews;




