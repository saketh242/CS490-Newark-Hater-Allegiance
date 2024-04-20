import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHistory, selectHistory } from './features/histories/historiesSlice';
import nhaService from './services/nhaService' // Adjust the path as per your project structure

const useHistoryManagement = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState('');

const reduxHandleGetAllHistory = async (user, dbUserRedux) => {
    try {
        setError(''); // Reset error
        const history = await nhaService.getAllHistory(user, dbUserRedux); 
        dispatch(setHistory(history));
      } catch (error) {
        setError('Unable to set the history at this time.');
      }
}

  const reduxHandleDeleteHistory = async (user, dbUserRedux, historyId = null) => {
    try {
      setError(''); // Reset error
      await nhaService.deleteHistory(user, dbUserRedux, historyId);
      dispatch(setHistory(selectHistory.filter((yeet) => {return yeet._id !==  historyId})));
    } catch (error) {
      setError('Unable to delete history at this time.');
    }
  };

  return { reduxHandleDeleteHistory, reduxHandleGetAllHistory, error };
};

export default useHistoryManagement;