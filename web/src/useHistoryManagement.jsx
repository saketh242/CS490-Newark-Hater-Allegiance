import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setHistory, clearHistory, deleteHistory } from './features/user/userSlice';
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
      if (historyId === null) {
        await nhaService.deleteHistory(user, dbUserRedux);
        dispatch(clearHistory());
      } else {
        await nhaService.deleteHistory(user, dbUserRedux, historyId);
        dispatch(deleteHistory({ historyId }));
      }
    } catch (error) {
      setError('Unable to delete history at this time.');
    }
  };

  return { reduxHandleDeleteHistory, reduxHandleGetAllHistory, error };
};

export default useHistoryManagement;