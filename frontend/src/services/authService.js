import api from './api';

/**
 * Authentication service — Flask API implementation.
 */

/**
 * Logs in a user by verifying credentials against the Flask backend.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object>} { user, token }
 */
export async function login(email, password) {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }
  const response = await api.post('/auth/login', { email, password });
  return response.data; // Expects { user, token }
}

/**
 * Registers a new patient user.
 * @param {Object} registerData { name, email, password }
 * @returns {Promise<Object>} { user, token }
 */
export async function register(registerData) {
  const { name, email, password } = registerData;
  if (!name || !email || !password) {
    throw new Error('All fields are required');
  }
  const response = await api.post('/auth/register', registerData);
  return response.data; // Expects { user, token }
}

/**
 * Invalidates the user session on the backend.
 * @returns {Promise<boolean>}
 */
export async function logout() {
  try {
    await api.post('/auth/logout');
  } catch (err) {
    console.error('Logout request failed', err);
  }
  return true;
}

/**
 * Retrieves the current authenticated user profile details.
 * @returns {Promise<Object>} The user profile object
 */
export async function getCurrentUser() {
  const response = await api.get('/auth/me');
  return response.data; // Expects user object
}

/**
 * Updates the profile of the current authenticated user.
 * @param {Object} data The profile fields to update
 * @returns {Promise<Object>} The updated user profile object
 */
export async function updateProfile(data) {
  const response = await api.put('/auth/profile', data);
  return response.data; // Expects updated user object
}
