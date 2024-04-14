import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRatings, stopFetchingRatings, startFetchingRatings, selectTotalFeedbackAverage, selectAverageTranslationRating, selectAverageUXRating } from './features/ratings/ratingsSlice';
import nhaService from './services/nhaService'

const useRatings = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(startFetchingRatings());
    const fetchRatings = async () => {
      try {
        const ratings = await nhaService.getAverageRatings();
        dispatch(setRatings(ratings));
      } catch (error) {
        console.error('Error fetching ratings:', error);
        dispatch(stopFetchingRatings());
      }
    };

    fetchRatings();
  }, [dispatch]);

//   const totalFeedbackAverage = useSelector(selectTotalFeedbackAverage);
//   const averageTranslationRating = useSelector(selectAverageTranslationRating);
//   const averageUXRating = useSelector(selectAverageUXRating);

//   return {
//     totalFeedbackAverage,
//     averageTranslationRating,
//     averageUXRating,
//   };
};

export default useRatings;
