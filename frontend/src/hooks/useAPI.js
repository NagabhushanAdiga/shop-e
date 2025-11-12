import { useState, useEffect } from 'react';
import dataManager from '../utils/apiHelper';

/**
 * Custom hook for data fetching with API and localStorage fallback
 */
export const useAPI = (apiCall, localStorageKey, fallbackData = []) => {
  const [data, setData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await dataManager.fetchWithFallback(
        apiCall,
        localStorageKey,
        fallbackData
      );
      setData(result);
    } catch (err) {
      setError(err.message);
      // Use fallback data on error
      const stored = localStorage.getItem(localStorageKey);
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        setData(fallbackData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refetch = () => {
    fetchData();
  };

  return { data, loading, error, refetch, setData };
};

/**
 * Custom hook for mutations (create, update, delete)
 */
export const useMutation = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = async (apiCall, options = {}) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      
      if (options.onSuccess) {
        options.onSuccess(result);
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      if (options.onError) {
        options.onError(err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { mutate, loading, error };
};

