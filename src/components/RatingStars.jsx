import React from 'react';
import { Star } from 'lucide-react';
import './RatingStars.css';

export const RatingStars = ({ rating = 0, maxStars = 5, showValue = true }) => {
  const stars = [];
  const normalizedRating = Math.max(0, Math.min(rating, maxStars));

  for (let i = 1; i <= maxStars; i++) {
    const isFilled = i <= Math.floor(normalizedRating);
    const isHalf = !isFilled && i <= Math.ceil(normalizedRating) && normalizedRating % 1 !== 0;

    stars.push(
      <Star
        key={i}
        size={16}
        className={`star-icon ${isFilled ? 'filled' : isHalf ? 'half' : 'empty'}`}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="rating-stars" title={`Rating: ${normalizedRating} out of ${maxStars}`}>
      <div className="stars-group">{stars}</div>
      {showValue && <span className="rating-value">{normalizedRating.toFixed(1)}</span>}
    </div>
  );
};
