import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT } from '../utils/constants';
import { getToken, removeToken, removeStoredUser } from '../utils/helpers';

/**
 * Axios instance configured with base URL, timeout, and auth interceptors.
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor — attach auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally and normalize error formats
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      removeToken();
      removeStoredUser();
      // Ensure we don't cause redirect loops if we are already on login page
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        window.location.href = '/login';
      }
    }
    
    // Extract the most descriptive error message possible from Flask payload
    const message = error.response?.data?.message 
      || error.response?.data?.error 
      || error.message 
      || 'An unexpected network error occurred';
      
    const apiError = new Error(message);
    apiError.status = error.response?.status;
    apiError.data = error.response?.data;
    apiError.originalError = error;
    
    return Promise.reject(apiError);
  }
);

export default api;
