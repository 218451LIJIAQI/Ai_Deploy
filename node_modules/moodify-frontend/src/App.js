/**
 * Main App Component - Moodify Music Recommendation App
 * Provides AI-powered music discovery based on user mood input
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';  
import MoodInput from './components/MoodInput';
import SongSuggestions from './components/SongSuggestions';
import AuthWrapper from './components/AuthWrapper';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

/**
 * FloatingNotes Component
 * Creates animated floating music notes for visual enhancement
 */
const FloatingNotes = () => {
  const notes = ['🎵', '🎶', '♪', '♫', '🎼'];
  const [noteElements, setNoteElements] = useState([]);

  useEffect(() => {
    // Generate random floating notes with animation properties
    const generateNotes = () => {
      const newNotes = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        note: notes[Math.floor(Math.random() * notes.length)],
        left: Math.random() * 100,
        animationDelay: Math.random() * 4,
        animationDuration: 3 + Math.random() * 2
      }));
      setNoteElements(newNotes);
    };

    generateNotes();
    // Regenerate notes every 12 seconds
    const interval = setInterval(generateNotes, 12000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
      {noteElements.map((item) => (
        <div
          key={item.id}
          className="music-note"
          style={{
            left: `${item.left}%`,
            animationDelay: `${item.animationDelay}s`,
            animationDuration: `${item.animationDuration}s`
          }}
        >
          {item.note}
        </div>
      ))}
    </div>
  );
};

/**
 * DesktopSidebar Component
 * Navigation sidebar with progress tracking and user authentication
 */
const DesktopSidebar = ({ currentStep, mood, songsCount, resetToInput, currentUser, onLogout }) => {
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      onLogout();
    }
  };

  return (
    <div className="desktop-sidebar">
      <div className="sidebar-content">
        {/* App branding section */}
        <div className="sidebar-branding">
          <h1 className="sidebar-title">
            🎵 MusicAI
          </h1>
          <p className="sidebar-subtitle">
            AI-Powered Music Discovery
          </p>
        </div>

        {/* User authentication info */}
        {currentUser && (
          <div className="user-info">
            <div className="user-welcome">
              <h4>👋 Welcome, {currentUser.username}!</h4>
              <p className="user-email">{currentUser.email}</p>
            </div>
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleLogout}
              className="logout-btn"
            >
              🚪 Logout
            </Button>
          </div>
        )}

        {/* Progress tracking steps */}
        <div className="progress-steps">
          <div className={`progress-step ${currentStep === 'input' ? 'active' : currentStep === 'loading' || currentStep === 'results' ? 'completed' : ''}`}>
            <div className="step-icon">🎯</div>
            <div className="step-content">
              <h4>Select Mood</h4>
              <p>Choose how you're feeling</p>
            </div>
          </div>
          
          <div className={`progress-step ${currentStep === 'loading' ? 'active' : currentStep === 'results' ? 'completed' : ''}`}>
            <div className="step-icon">🤖</div>
            <div className="step-content">
              <h4>AI Analysis</h4>
              <p>Processing your vibe</p>
            </div>
          </div>
          
          <div className={`progress-step ${currentStep === 'results' ? 'active' : ''}`}>
            <div className="step-icon">🎵</div>
            <div className="step-content">
              <h4>Music Results</h4>
              <p>{songsCount > 0 ? `${songsCount} songs found` : 'Discover tracks'}</p>
            </div>
          </div>
        </div>

        {/* Current session information */}
        {mood && (
          <div className="session-info">
            <h4>Current Session</h4>
            <div className="current-mood">
              <span className="mood-label">Mood:</span>
              <span className="mood-value">{mood}</span>
            </div>
            {currentStep === 'results' && (
              <button
                className="reset-btn"
                onClick={resetToInput}
              >
                🔄 New Search
              </button>
            )}
          </div>
        )}

        {/* App footer information */}
        <div className="sidebar-footer">
          <p>Powered by Spotify API</p>
          <p>Built with React & AI</p>
        </div>
      </div>
    </div>
  );
};

/**
 * MainApp Component
 * Core application logic handling mood selection and music recommendations
 */
function MainApp({ currentUser, onLogout }) {
  // State management for app flow
  const [mood, setMood] = useState('');
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState('input'); // Possible values: 'input', 'loading', 'results'

  // Handle mood selection and initiate loading
  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood);
    setCurrentStep('loading');
    setIsLoading(true);
  };

  // Handle successful song fetch completion
  const handleSongsFetched = (fetchedSongs) => {
    setSongs(fetchedSongs);
    setIsLoading(false);
    setCurrentStep('results');
  };

  // Handle errors during mood detection or song fetching
  const handleError = () => {
    setIsLoading(false);
    setCurrentStep('input');
  };

  // Reset application to initial input state
  const resetToInput = () => {
    setCurrentStep('input');
    setSongs([]);
    setMood('');
    setIsLoading(false);
  };

  return (
    <div className="desktop-app-container">
      <FloatingNotes />
      
      <div className="desktop-layout">
        <DesktopSidebar 
          currentStep={currentStep}
          mood={mood}
          songsCount={songs.length}
          resetToInput={resetToInput}
          currentUser={currentUser}
          onLogout={onLogout}
        />

        {/* Main content area with responsive layout */}
        <div className="main-content-area">
          <Container fluid className="h-100">
            <Row className="h-100">
              <Col xs={12} className="main-content-col">
                {/* Dynamic header based on current step */}
                <div className="content-header">
                  <h2 className="page-title">
                    {currentStep === 'input' && '🎯 What\'s Your Vibe?'}
                    {currentStep === 'loading' && '🤖 Analyzing Your Mood...'}
                    {currentStep === 'results' && `🎵 ${songs.length} Songs for ${mood}`}
                  </h2>
                  {currentStep === 'input' && (
                    <p className="page-subtitle">
                      Choose how you'd like to express your current mood and let AI find the perfect soundtrack
                    </p>
                  )}
                </div>

                {/* Mood input section - shown during input step */}
                {currentStep === 'input' && (
                  <div className="input-section">
                    <MoodInput
                      onMoodSelect={handleMoodSelect}
                      onSongsFetched={handleSongsFetched}
                      onError={handleError}
                      isLoading={isLoading}
                    />
                  </div>
                )}

                {/* Results section - shown during loading and results steps */}
                {(currentStep === 'loading' || currentStep === 'results') && (
                  <div className="results-section">
                    <SongSuggestions 
                      songs={isLoading ? null : songs} 
                      mood={mood} 
                      onFindMoreSongs={resetToInput}
                    />
                  </div>
                )}
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </div>
  );
}

/**
 * App Component
 * Root component with authentication wrapper
 */
function App() {
  return (
    <AuthWrapper>
      <MainApp />
    </AuthWrapper>
  );
}

export default App;
