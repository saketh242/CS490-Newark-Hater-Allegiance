/* SHADED STARS FOR REVIEWS */

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';


const StarRating = ({ averageRating, size, className }) => {
  const totalStars = 5;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating - fullStars >= 0.5;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = () => {
    let stars = [];
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={i} className="star filled">
        <FontAwesomeIcon icon={solidStar} size={size} className={className}/>
      </span>);
    }
    if (hasHalfStar) {
    stars.push(<span key="half" className="star half">
        <FontAwesomeIcon icon={faStarHalfStroke} size={size} className={className}/>
    </span>);

    }
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty${i}`} className="star">
        <FontAwesomeIcon icon={emptyStar} size={size} className={className}/>
      </span>);
    }
    return stars;
  };

  return (
    <div className="star-rating">
      {renderStars()}
    </div>
  );
};

export default StarRating;
