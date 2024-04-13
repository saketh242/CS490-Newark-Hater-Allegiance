import React, { useState, useEffect } from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Gravatar from 'react-gravatar'
import nhaService from '../services/nhaService';
import { useSelector } from 'react-redux';
import StarRating from './StarRating'

const HomeReviews = () => {
  const { reviews, fetchingReviews } = useSelector((state) => state.reviews);

  /*temporary rating values */
  const overallRating = 4.5;
  const translateRating = 3.8;
  const uxRating = 4.8;

  return (
    <div>
      <div id="ratingAverages">
        <div id="overallAverageRating">
          <h2 id="totalRatingText">Total Rating: {overallRating} / 5</h2>
          <StarRating averageRating={overallRating} size={"3x"} className={"rainbow"}></StarRating>
        </div>
        <div id="lesserRatings">
          <div id="translationAverageRating">
            <p className="specificRatingCategory">Translation Quality: {translateRating} / 5</p>
            <StarRating averageRating={translateRating} size={"2x"} className={"ratingStarStandard"}></StarRating>
          </div>
          <div id="uxAverageRating">
            <p className="specificRatingCategory">User Experience: {uxRating} / 5</p>
            <StarRating averageRating={uxRating} size={"2x"} className={"ratingStarStandard"}></StarRating>
          </div>
        </div>
      </div>
      
      <div className='box reviews' id="reviewContainer">
        <p id="reviewHeader" className="sectionHeader">Some of our reviews</p>
        <div className="reviews-flexbox">
          {(reviews && !fetchingReviews) ? (
            <Carousel className="homeCarousel" infiniteLoop showStatus={false} showThumbs={false}>
              {reviews.map((review, index) => (
                <div className="review" key={index}>
                  <p>{`⭐⭐⭐⭐⭐`}</p>
                  <p>{`${review.textMessage}`}</p>
                  <div id="reviewUserDetails">

                    <Gravatar id="homereviewerIcon" alt="Gravatar for reviewer" size={500} default="mp" email={review.user.email} />
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
    </div>
  );
}

export default HomeReviews;