import api from './api';

/**
 * Exercise service — Flask API implementation.
 */

/**
 * Fetches the exercise list, optionally filtered by category and search queries.
 * @param {Object} filters { category, search }
 * @returns {Promise<Array>} List of matching exercises
 */
export async function getExercises(filters = {}) {
  const params = {};
  if (filters.category && filters.category !== 'All') {
    params.category = filters.category;
  }
  if (filters.search) {
    params.search = filters.search;
  }

  const response = await api.get('/exercises', { params });
  return response.data; // Expects array of exercises
}

/**
 * Fetches details for a specific exercise by ID.
 * @param {string} id 
 * @returns {Promise<Object|null>} The exercise object
 */
export async function getExerciseById(id) {
  if (!id) return null;
  const response = await api.get(`/exercises/${id}`);
  return response.data; // Expects exercise details
}
