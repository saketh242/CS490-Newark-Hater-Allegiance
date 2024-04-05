
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import nhaService from './services/nhaService'; 
import { setReviews, startFetchingReviews, stopFetchingReviews } from './features/reviews/reviewSlice';

const useFetchReviews = () => {
  const dispatch = useDispatch();

  useEffect(() => {
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
  }, [dispatch]);
}

export default useFetchReviews;
