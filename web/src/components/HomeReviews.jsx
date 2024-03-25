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

// import React, { useState, useEffect } from 'react';
// import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
// import { Carousel } from 'react-responsive-carousel';

// import nhaService from '../services/nhaService';
// import useAuth from '../useAuth';

// const HomeReviews = () => {
//   const { user } = useAuth();
//   const [reviews, setReviews] = useState([]);

//     useEffect(() => {
//       async function fetchReviews() {
//         try {
//           const response = response = await nhaService.getFeedback(user);
//           setReviews(response.data);
//           console.log(reviews);
//         } catch (error) {
//           console.error('Error fetching reviews:', error);
//         }
//       }
  
//       fetchReviews();
//     }, []);
  
//     return (
//       <div className='box reviews'>
//         <p id="reviewHeader" className="sectionHeader">Some of our reviews</p>
//         <div className="reviews-flexbox">
//           {reviews.map((review, index) => (
//             <div className="review" id={`review-${index}`} key={index}>
//               <p>{`⭐⭐⭐⭐⭐<br></br>${review.textMessage}<br></br>- ${review.user}`}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

// export default HomeReviews;