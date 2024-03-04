import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const HomeReviews = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <div className='boxReviews'>
      <p>Some of our reviews</p>
      <div style={{ width: '80%', margin: 'auto' }}> {/* Example wrapper styling */}
        <Slider {...settings}>
          <div>
            <p>Rating ?/5<br />Review Text<br />- User Name</p>
          </div>
          {/* Add other carousel items */}
        </Slider>
      </div>
    </div>
  );
};

export default HomeReviews;
