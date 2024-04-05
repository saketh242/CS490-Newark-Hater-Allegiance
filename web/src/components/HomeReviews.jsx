import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Gravatar from 'react-gravatar'
import nhaService from '../services/nhaService';
import { useSelector } from 'react-redux';

const HomeReviews = () => {
  const { reviews, fetchingReviews } = useSelector((state) => state.reviews);

  // Get 6 random reviews with text messages of 150 characters or less
  const randomReviews = reviews
    .filter(review => review.textMessage.length <= 150)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  console.log(randomReviews)

  return (
    <div className='box reviews' id="reviewContainer">
      <p id="reviewHeader" className="sectionHeader">Some of our reviews</p>
      <div className="reviews-flexbox">
        {(randomReviews && randomReviews.length > 0 && !fetchingReviews) ? (
          <Carousel className="homeCarousel" infiniteLoop showStatus={false} showThumbs={false}>
            {randomReviews.map((review, index) => (
              <div className="review" key={index}>
                <p>{`⭐⭐⭐⭐⭐`}</p>
                <p>{`${review.textMessage}`}</p>
                <div id="reviewUserDetails">
                  <Gravatar id="homereviewerIcon" size={500} default="mp" email={review.user.email} />
                <p>{`${review.user.firstName} ${review.user.lastName}`}</p>
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