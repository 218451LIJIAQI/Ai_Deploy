/**
 * AuthWrapper Component
 * Handles user authentication state and provides authentication context
 * Wraps the main application with login/register forms when unauthenticated
 */

import React, { useState, useEffect } from 'react';
import { Spinner, Container } from 'react-bootstrap';
import Login from './Login';
import Register from './Register';
import authService from './authService';

const AuthWrapper = ({ children }) => {
  // Authentication state management
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Check authentication status on component mount
   * Validates local storage and server authentication
   */
  const checkAuthStatus = async () => {
    setIsLoading(true);
    try {
      // Check local authentication first for better UX
      if (authService.isAuthenticated()) {
        const userData = authService.getCurrentUser();
        if (userData) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }
      }

      // Verify authentication with server
      const response = await authService.checkAuth();
      if (response.success && response.authenticated) {
        setCurrentUser(response.user);
        setIsAuthenticated(true);
      } else {
        // Clear stale authentication data
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle successful login
   * Updates authentication state with user data
   */
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Handle successful registration
   * Updates authentication state with new user data
   */
  const handleRegisterSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  /**
   * Handle user logout
   * Clears authentication state and calls logout service
   */
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  };

  /**
   * Switch from login to register form
   */
  const switchToRegister = () => {
    setShowLogin(false);
  };

  /**
   * Switch from register to login form
   */
  const switchToLogin = () => {
    setShowLogin(true);
  };

  // Show loading spinner during authentication check
  if (isLoading) {
    return (
      <Container fluid className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <p>Loading...</p>
        </div>
      </Container>
    );
  }

  // Show authentication forms for unauthenticated users
  if (!isAuthenticated) {
    return (
      <>
        {showLogin ? (
          <Login
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <Register
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </>
    );
  }

  // Render main application with user context for authenticated users
  return React.cloneElement(children, {
    currentUser,
    onLogout: handleLogout
  });
};

export default AuthWrapper; 