import React, { useState } from 'react';

const ReviewForm = ({ productId, initialData = {}, onSubmit }) => {
  const [rating, setRating] = useState(initialData.rating || 5);
  const [comment, setComment] = useState(initialData.comment || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, comment });
    setRating(5);
    setComment('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Rating:
          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Comment:
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
      </div>
      <button type="submit">{initialData.id ? 'Update Review' : 'Submit Review'}</button>
    </form>
  );
};

export default ReviewForm;

