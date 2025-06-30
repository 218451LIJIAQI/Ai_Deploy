/**
 * Login Component
 * Handles user authentication with form validation and error handling
 * Provides a responsive login interface with loading states
 */

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import authService from './authService';

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  // Form state management
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('danger');

  /**
   * Handle input field changes and clear field-specific errors
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for the field being edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  /**
   * Validate form inputs before submission
   * Returns true if form is valid, false otherwise
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Display alert message with auto-hide functionality
   */
  const showMessage = (message, type = 'danger') => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 5000);
  };

  /**
   * Handle form submission and authentication
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setShowAlert(false);
    
    try {
      const response = await authService.login({
        username: formData.username,
        password: formData.password
      });
      
      if (response.success) {
        showMessage('Login successful! Redirecting...', 'success');
        // Delay redirect to show success message
        setTimeout(() => {
          onLoginSuccess(response.user);
        }, 1000);
      } else {
        showMessage(response.message || 'Login failed');
      }
    } catch (error) {
      showMessage(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-gradient">
      <Row className="w-100 justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="auth-card shadow-lg border-0">
            <Card.Body className="p-5">
              {/* Page header with branding */}
              <div className="text-center mb-4">
                <h1 className="auth-title mb-2">🎵 Welcome Back</h1>
                <p className="auth-subtitle text-muted">Sign in to continue your musical journey</p>
              </div>

              {/* Alert messages */}
              {showAlert && (
                <Alert variant={alertType} className="mb-4">
                  {alertMessage}
                </Alert>
              )}

              {/* Login form */}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    isInvalid={!!errors.username}
                    className="auth-input"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.username}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    isInvalid={!!errors.password}
                    className="auth-input"
                    disabled={isLoading}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit button with loading state */}
                <Button
                  type="submit"
                  className="auth-button w-100 mb-3"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>

              {/* Registration link */}
              <div className="text-center">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Button
                    variant="link"
                    className="auth-link p-0"
                    onClick={onSwitchToRegister}
                    disabled={isLoading}
                  >
                    Create Account
                  </Button>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login; 