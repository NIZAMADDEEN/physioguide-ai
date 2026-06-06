import { createContext, useState, useEffect, useMemo, useCallback } from 'react';
import { getExercises as fetchExercisesApi } from '../services/exerciseService';

export const ExerciseContext = createContext(null);

export function ExerciseProvider({ children }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [filters, setFilters] = useState({ category: 'All', search: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch exercises from the service based on category and search query
  const loadExercises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExercisesApi(filters);
      setExercises(data);
    } catch (err) {
      setError(err.message || 'Failed to load exercises');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadExercises();
  }, [loadExercises]);

  const setCategoryFilter = useCallback((category) => {
    setFilters((prev) => ({ ...prev, category }));
  }, []);

  const setSearchQuery = useCallback((search) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const selectExercise = useCallback((exercise) => {
    setSelectedExercise(exercise);
  }, []);

  const clearSelectedExercise = useCallback(() => {
    setSelectedExercise(null);
  }, []);

  const value = useMemo(
    () => ({
      exercises,
      selectedExercise,
      filters,
      loading,
      error,
      setCategoryFilter,
      setSearchQuery,
      selectExercise,
      clearSelectedExercise,
      refetchExercises: loadExercises,
    }),
    [
      exercises,
      selectedExercise,
      filters,
      loading,
      error,
      setCategoryFilter,
      setSearchQuery,
      selectExercise,
      clearSelectedExercise,
      loadExercises,
    ]
  );

  return <ExerciseContext.Provider value={value}>{children}</ExerciseContext.Provider>;
}
