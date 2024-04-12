import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import nhaService from './services/nhaService'; 
import { setReviews, startFetchingReviews, stopFetchingReviews } from './features/reviews/reviewSlice';

const useFetchReviews = () => {
  const dispatch = useDispatch();
  const [shouldFetch, setShouldFetch] = useState(false); 

  useEffect(() => {
    if (shouldFetch) {
      dispatch(startFetchingReviews());
      const fetchReviews = async () => {
        try {
          const reviewsData = await nhaService.getFeedback(); 
          dispatch(setReviews(reviewsData));
        } catch (error) {
          console.error("Error fetching reviews:", error);
          dispatch(stopFetchingReviews());
        }
      };

      fetchReviews();
    }
  }, [dispatch, shouldFetch]);

  return { setShouldFetch };
}

export default useFetchReviews;
