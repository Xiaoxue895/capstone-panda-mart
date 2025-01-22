import React, { useState } from 'react';

const ReviewForm = ({ productId, onSubmit }) => {
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState('');
  const [recommendation, setRecommendation] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ stars, review, recommendation }); 
    setStars(5);
    setReview('');
    setRecommendation(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Stars:
          <input
            type="number"
            min="1"
            max="5"
            value={stars}
            onChange={(e) => setStars(Number(e.target.value))}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Review:
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Recommend this product?
          <input
            type="checkbox"
            checked={recommendation}
            onChange={(e) => setRecommendation(e.target.checked)}
          />
        </label>
      </div>
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;





