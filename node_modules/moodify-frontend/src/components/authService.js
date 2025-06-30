/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 * Provides centralized authentication logic for the application
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

// Create configured axios instance for authentication endpoints
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically include authentication token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle authentication errors globally
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access - clear tokens and redirect
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Register new user account
   * @param {Object} userData - User registration data (username, email, password)
   * @returns {Promise<Object>} Registration response with user data and token
   */
  register: async (userData) => {
    try {
      const response = await authAPI.post('/api/auth/register/', userData);
      if (response.data.success) {
        // Store authentication token and user data locally
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  /**
   * Authenticate user login
   * @param {Object} credentials - Login credentials (username, password)
   * @returns {Promise<Object>} Login response with user data and token
   */
  login: async (credentials) => {
    try {
      const response = await authAPI.post('/api/auth/login/', credentials);
      if (response.data.success) {
        // Store authentication token and user data locally
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  /**
   * Logout current user
   * Clears local storage and invalidates server session
   */
  logout: async () => {
    try {
      await authAPI.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local storage regardless of API response
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  },

  /**
   * Verify authentication status with server
   * @returns {Promise<Object>} Authentication status and user data
   */
  checkAuth: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        return { success: false, authenticated: false };
      }
      
      const response = await authAPI.get('/api/auth/check/');
      return response.data;
    } catch (error) {
      // Clear invalid authentication data
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return { success: false, authenticated: false };
    }
  },

  /**
   * Get current user data from local storage
   * @returns {Object|null} User data object or null if not found
   */
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Check if user is currently authenticated
   * @returns {boolean} True if user has valid token and data
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
  },

  /**
   * Get stored authentication token
   * @returns {string|null} Authentication token or null
   */
  getToken: () => {
    return localStorage.getItem('authToken');
  }
};

export default authService; 