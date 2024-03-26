import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';

import nhaService from '../services/nhaService';

const HomeReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await nhaService.getFeedback();
        const extractedReviews = response.map(item => ({
          textMessage: item.textMessage,
          user: `${item.user.firstName} ${item.user.lastName}`
        }));
        setReviews(extractedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }

    fetchReviews();
  }, []);

  // Get 5 random reviews with text messages of 100 characters or less
  const randomReviews = reviews
    .filter(review => review.textMessage.length <= 100)
    .sort(() => Math.random() - 0.5)
    .slice(0, 5);

  return (
    <div className='box reviews' id="reviewContainer">
      <p id="reviewHeader" className="sectionHeader">Some of our reviews</p>
      <div className="reviews-flexbox">
        <Carousel className="homeCarousel" infiniteLoop showStatus={false}>
          {randomReviews && randomReviews.length > 0 ? (
            randomReviews.map((review, index) => (
              <div className="review" key={index}>
                <p>{`⭐⭐⭐⭐⭐`}</p>
                <p>{`${review.textMessage}`}</p>
                <p>{`- ${review.user}`}</p>
              </div>
            ))
          ) : (
            <p>Loading reviews...</p>
          )}
        </Carousel>
      </div>
    </div>
  );
};

export default HomeReviews;