/**
 * React Application Entry Point
 * Initializes the Moodify music recommendation app with global configurations
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';

// Global UI enhancements
document.documentElement.style.scrollBehavior = 'smooth';

// Optional: Prevent right-click for app-like experience
// document.addEventListener('contextmenu', (e) => e.preventDefault());

// Set default cursor style
document.body.style.cursor = 'default';

// Performance optimization check
if ('IntersectionObserver' in window) {
  // Browser supports modern features for lazy loading
  console.log('🎵 MusicAI: Enhanced features enabled');
}

// Initialize React application
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
