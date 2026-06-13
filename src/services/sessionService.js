import api from './api';

/**
 * Session & Analytics service — Flask API implementation.
 */

/**
 * Starts a new therapy session for an exercise on the backend.
 * @param {string} exerciseId 
 * @returns {Promise<Object>} The session configuration details
 */
export async function startSession(exerciseId) {
  const response = await api.post('/sessions', { exerciseId });
  return response.data; // Expects { sessionId, exerciseId, startedAt, status: 'active' }
}

/**
 * Sends real-time posture tracking and rep count updates during a session.
 * @param {string} sessionId 
 * @param {Object} metrics { reps, accuracy, statusMsg }
 * @returns {Promise<Object>}
 */
export async function updateSessionMetrics(sessionId, { reps, accuracy, statusMsg }) {
  const response = await api.put(`/sessions/${sessionId}`, { reps, accuracy, statusMsg });
  return response.data;
}

/**
 * Ends a session, updates statistics, and saves records on the backend.
 * @param {string} sessionId 
 * @param {Object} summaryData { reps, accuracy, duration }
 * @returns {Promise<Object>} Consolidated session details
 */
export async function endSession(sessionId, summaryData) {
  const response = await api.post(`/sessions/${sessionId}/end`, summaryData);
  return response.data;
}

/**
 * Fetches the recovery trend scores (e.g. 7, 30, or 90 days).
 * @param {number} range 
 * @returns {Promise<Array>} Recovery trends data points
 */
export async function getProgressData(range = 30) {
  const response = await api.get('/analytics/progress', { params: { range } });
  return response.data; // Expects array of progress points
}

/**
 * Fetches the current mobility score details across regions (knee, shoulder, etc.).
 * @returns {Promise<Array>} Mobility details
 */
export async function getMobilityScores() {
  const response = await api.get('/analytics/mobility');
  return response.data; // Expects array of region metrics
}

/**
 * Fetches the weekly categories goal adherence.
 * @returns {Promise<Array>} Weekly exercise categories counts
 */
export async function getWeeklyExercises() {
  const response = await api.get('/analytics/weekly');
  return response.data; // Expects array of adherence levels
}

/**
 * Fetches the recent activities timeline events list.
 * @param {number} range 
 * @returns {Promise<Array>} Timeline events
 */
export async function getTimeline(range = 30) {
  const response = await api.get('/analytics/timeline', { params: { range } });
  return response.data; // Expects array of activities
}

/**
 * Fetches the user's total sessions, average accuracy, and active streak.
 * @returns {Promise<Object>} { total_sessions, average_accuracy, active_streak }
 */
export async function getSummaryStats() {
  const response = await api.get('/analytics/summary');
  return response.data;
}

/**
 * Fetches the distribution of completed exercises by category.
 * @returns {Promise<Array>} Array of { name, count } objects
 */
export async function getExerciseDistribution() {
  const response = await api.get('/analytics/distribution');
  return response.data;
}

/**
 * Initializes the CV tracker for a session.
 * @param {string} sessionId 
 * @param {string} exerciseId 
 * @returns {Promise<Object>} Tracker state
 */
export async function startTracker(sessionId, exerciseId) {
  const response = await api.post('/cv/start-tracker', { sessionId, exerciseId });
  return response.data;
}

/**
 * Sends a base64 encoded video frame to the backend for CV processing.
 * @param {string} sessionId 
 * @param {string} exerciseId 
 * @param {string} frame Base64 string (without data URL prefix)
 * @returns {Promise<Object>} Tracking results (landmarks, angles, reps, etc.)
 */
export async function processFrame(sessionId, exerciseId, frame) {
  const response = await api.post('/cv/process-frame', { sessionId, exerciseId, frame });
  return response.data;
}
