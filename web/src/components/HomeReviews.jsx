import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Gravatar from 'react-gravatar'
import nhaService from '../services/nhaService';

const HomeReviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await nhaService.getFeedback();
        const extractedReviews = response.map(item => ({
          textMessage: item.textMessage,
          user: `${item.user.firstName} ${item.user.lastName}`,
          email:item.user.email
        }));
        setReviews(extractedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    }

    fetchReviews();
  }, []);

  // Get 6 random reviews with text messages of 150 characters or less
  const randomReviews = reviews
    .filter(review => review.textMessage.length <= 150)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  return (
    <div className='box reviews' id="reviewContainer">
      <p id="reviewHeader" className="sectionHeader">Some of our reviews</p>
      <div className="reviews-flexbox">
        {randomReviews && randomReviews.length > 0 ? (
          <Carousel className="homeCarousel" infiniteLoop showStatus={false} showThumbs={false}>
            {randomReviews.map((review, index) => (
              <div className="review" key={index}>
                <p>{`⭐⭐⭐⭐⭐`}</p>
                <p>{`${review.textMessage}`}</p>
                <div id="reviewUserDetails">
                  <Gravatar id="homereviewerIcon" size={30} default="mp" email={review.email} />
                <p>{`${review.user}`}</p>
                </div>
              </div>
            ))}
          </Carousel>
        ) : (
          <p className="loadingText" style={{ textAlign: 'center', margin: '4rem' }}>
            Loading reviews
            <span className="dot1">.</span>
            <span className="dot2">.</span>
            <span className="dot3">.</span>
          </p>
        )}
      </div>
    </div>
  );
}

export default HomeReviews;