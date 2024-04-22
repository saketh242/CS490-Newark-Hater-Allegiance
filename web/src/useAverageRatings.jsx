import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setRatings, stopFetchingRatings, startFetchingRatings } from './features/ratings/ratingsSlice'
import nhaService from './services/nhaService'

const useRatings = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(startFetchingRatings());
    const fetchRatings = async () => {
      try {
        const ratings = await nhaService.getAverageRatings()
        dispatch(setRatings(ratings))
      } catch (error) {
        dispatch(stopFetchingRatings())
      }
    }

    fetchRatings()
  }, [dispatch])
}

export default useRatings