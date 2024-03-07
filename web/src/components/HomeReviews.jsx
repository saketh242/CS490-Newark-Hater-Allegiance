import React from 'react';

const HomeReviews = () => {
  return (
    <div className='box reviews'>
    <p id="reviewHeader" className="sectionHeader">Some of our reviews</p>
    <div className="reviews-flexbox">
      <div id='review'><p>⭐⭐⭐⭐⭐<br></br>I like this app<br></br>- John Doe</p></div>
      <div id='review'><p>⭐⭐⭐⭐⭐<br></br>this is really helpful for school<br></br>- NJIT student</p></div>
      <div id='review'><p>⭐⭐⭐⭐⭐<br></br>I hate newark<br></br>- #1NewarkHater</p></div>
      <div id='review'><p>⭐⭐⭐⭐⭐<br></br>Accurate and reliable!<br></br>- Jane</p></div>
    </div>
  </div>
  );
};

export default HomeReviews;
