import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for performing GET/Query operations.
 * Fetches data on mount/dependency change.
 * @param {Function} apiFunc - The service function to call (e.g., getExercises)
 * @param {Array} args - Arguments to pass to the function
 * @param {Array} dependencies - React useEffect dependencies to trigger a re-fetch
 * @returns {Object} { data, loading, error, refetch }
 */
export function useQuery(apiFunc, args = [], dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunc(...args);
      setData(result);
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiFunc, JSON.stringify(args)]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}

// Alias for backwards compatibility with existing code
export const useApi = useQuery;

/**
 * Hook for performing POST/PUT/DELETE operations.
 * Returns a execution function (mutate) and status states.
 * @param {Function} apiFunc - The mutation API function to call
 * @returns {Array} [mutate, { data, loading, error }]
 */
export function useMutation(apiFunc) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mutate = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);
        const result = await apiFunc(...args);
        setData(result);
        return result;
      } catch (err) {
        setError(err.message || 'Mutation failed');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunc]
  );

  return [mutate, { data, loading, error }];
}

