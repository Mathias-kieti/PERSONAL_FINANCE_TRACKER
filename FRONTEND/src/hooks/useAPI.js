import { useState, useCallback } from 'react';
import api from './services/api';

/**
 * Custom hook to handle API requests with loading and error state
 * @param {Function} apiFunc - API function from services/api.js
 */
export const useApi = (apiFunc) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const callApi = useCallback(
    async (...params) => {
      setLoading(true);
      setError(null);

      try {
        const response = await apiFunc(...params);
        setData(response);
        return response;
      } catch (err) {
        const message = err.response?.data?.message || err.message || 'Something went wrong';
        setError(message);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return { data, loading, error, callApi };
};

export default useApi;
