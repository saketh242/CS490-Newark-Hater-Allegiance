import React from 'react';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import Gravatar from 'react-gravatar'
import { useSelector } from 'react-redux';
import StarRating from './StarRating'
import { selectTotalFeedbackAverage, selectAverageTranslationRating, selectAverageUXRating, selectFetchingRatings, selectCount } from '../features/ratings/ratingsSlice'

const HomeReviews = () => {
  const { reviews, fetchingReviews } = useSelector((state) => state.reviews);

  const totalFeedbackAverage = useSelector(selectTotalFeedbackAverage);
  const averageTranslationRating = useSelector(selectAverageTranslationRating);
  const averageUXRating = useSelector(selectAverageUXRating);
  const fetchingRatings = useSelector(selectFetchingRatings);
  const count = useSelector(selectCount);

  return (
    <div>
      <div id="ratingAverages">
        {(totalFeedbackAverage && averageTranslationRating && averageUXRating && !fetchingRatings) ? (
          <>
            <div id="overallAverageRating">
              <p id="totalRatingText" data-testid="totalRating">Total Rating: {totalFeedbackAverage} / 5</p>
              <StarRating averageRating={totalFeedbackAverage} size={"4x"} className={"rainbow"} data-testid="overallStars"></StarRating>
              <p id="totalReviews">based off of {count} reviews</p>
            </div>
            <div id="lesserRatings">
              <div id="translationAverageRating">
                <p className="specificRatingCategory" data-testid="translationQuality">Translation Quality: {averageTranslationRating} / 5</p>
                <StarRating averageRating={averageTranslationRating} size={"2x"} className={"ratingStarStandard"} data-testid="translationStars"></StarRating>
              </div>
              <div id="uxAverageRating">
                <p className="specificRatingCategory" data-testid="userExperience">User Experience: {averageUXRating} / 5</p>
                <StarRating averageRating={averageUXRating} size={"2x"} className={"ratingStarStandard"} data-testid="uxStars"></StarRating>
              </div>
            </div>
          </>
        ) : (
          <>
            <p>Fetching ratings</p>
          </>
        )}
      </div>

      <div className='box reviews' id="reviewContainer">
        <p id="reviewHeader" className="sectionHeader">Some of our reviews</p>
        <div className="reviews-flexbox">
          {(reviews.length !== 0  && !fetchingReviews) ? (
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