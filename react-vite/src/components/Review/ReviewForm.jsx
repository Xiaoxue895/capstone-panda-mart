import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkCreateReview, thunkUpdateReview } from '../../redux/review';

const ReviewForm = ({ productId, reviewToEdit = null }) => {
  const dispatch = useDispatch();

  // Local state for managing form input
  const [rating, setRating] = useState(reviewToEdit ? reviewToEdit.rating : 0);
  const [comment, setComment] = useState(reviewToEdit ? reviewToEdit.comment : '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (reviewToEdit) {
      // If editing an existing review, populate the form with the review data
      setRating(reviewToEdit.rating);
      setComment(reviewToEdit.comment);
    }
  }, [reviewToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !comment.trim()) {
      setError('Please provide both a rating and a comment.');
      return;
    }

    const reviewData = {
      rating,
      comment,
    };

    if (reviewToEdit) {
      // If we're editing a review, dispatch the update action
      await dispatch(thunkUpdateReview(reviewToEdit.id, reviewData));
    } else {
      // Otherwise, dispatch the create action
      await dispatch(thunkCreateReview(productId, reviewData));
    }
  };

  return (
    <div>
      <h2>{reviewToEdit ? 'Edit Your Review' : 'Write a Review'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="rating">Rating:</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="comment">Comment:</label>
          <textarea
            id="comment"
            name="comment"
            rows="4"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit">{reviewToEdit ? 'Update Review' : 'Submit Review'}</button>
      </form>
    </div>
  );
};

export default ReviewForm;
