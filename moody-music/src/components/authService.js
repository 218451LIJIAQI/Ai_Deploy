/**
 * Authentication Service
 * Handles all authentication-related API calls and token management
 * Provides centralized authentication logic for the application
 */

import axios from 'axios';

// ✅ Hardcoded backend base URL (you don't need .env)
const API_BASE_URL = 'https://ai-deploy-2.onrender.com';

// ✅ Create a configured axios instance
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request interceptor: automatically attach auth token
authAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: handle unauthorized globally
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  /**
   * Register new user
   * @param {Object} userData - { username, email, password }
   * @returns {Promise<Object>}
   */
  register: async (userData) => {
    try {
      const response = await authAPI.post('/api/auth/register/', userData);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Registration failed' };
    }
  },

  /**
   * Log in user
   * @param {Object} credentials - { username, password }
   * @returns {Promise<Object>}
   */
  login: async (credentials) => {
    try {
      const response = await authAPI.post('/api/auth/login/', credentials);
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: 'Login failed' };
    }
  },

  /**
   * Log out user
   * Clears local storage and ends server session
   */
  logout: async () => {
    try {
      await authAPI.post('/api/auth/logout/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
  },

  /**
   * Check authentication status with server
   * @returns {Promise<Object>} - { success, authenticated }
   */
  checkAuth: async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return { success: false, authenticated: false };

      const response = await authAPI.get('/api/auth/check/');
      return response.data;
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      return { success: false, authenticated: false };
    }
  },

  /**
   * Get current user data from localStorage
   * @returns {Object|null}
   */
  getCurrentUser: () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  },

  /**
   * Check if user is authenticated (local check)
   * @returns {boolean}
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    return !!(token && userData);
  },

  /**
   * Get auth token from localStorage
   * @returns {string|null}
   */
  getToken: () => localStorage.getItem('authToken'),
};

export default authService;
