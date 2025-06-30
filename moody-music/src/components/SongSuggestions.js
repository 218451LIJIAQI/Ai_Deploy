// src/components/SongSuggestions.js
import React from 'react';
import { Row, Col, Alert, Container } from 'react-bootstrap';
import jsPDF from 'jspdf';

/**
 * SongSuggestions Component
 * Displays music recommendations in a responsive grid layout
 * Handles loading states, empty states, and PDF playlist export functionality
 */

/**
 * Main component for displaying song recommendations
 * @param {Array|null} songs - Array of song objects or null during loading
 * @param {string} mood - Current mood/genre for display purposes
 * @param {Function} onFindMoreSongs - Callback to trigger new search
 */
const SongSuggestions = ({ songs, mood, onFindMoreSongs }) => {
  // Loading state - show animated spinner while fetching songs
  if (songs === null) {
    return (
      <div className="desktop-loading-container fade-in">
        <div className="loading-grid">
          <div className="loading-content">
            <div className="loading-spinner-large"></div>
            <h3 className="loading-title">Curating Your Perfect Playlist</h3>
            <p className="loading-subtitle">
              AI is analyzing millions of tracks to find songs that perfectly match your vibe...
            </p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty state - show helpful message when no songs found
  if (!Array.isArray(songs) || songs.length === 0) {
    return (
      <div className="desktop-empty-state fade-in">
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} className="text-center">
              <div className="empty-state-content">
                <div className="empty-icon"></div>
                <h3 className="empty-title">No Vibes Found</h3>
                <p className="empty-description">
                  We couldn't find songs matching this mood. This might be because:
                </p>
                <ul className="empty-suggestions">
                  <li>The mood is too specific or uncommon</li>
                  <li>The AI couldn't parse your text description</li>
                  <li>There's a temporary issue with the music database</li>
                </ul>
                <p className="empty-hint">
                  Try a different mood or use the genre selector for better results!
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }

  /**
   * Export current playlist to PDF format
   * Creates a professionally formatted document with playlist details
   */
  const handleExportPlaylist = () => {
    if (!songs || songs.length === 0) {
      alert('No songs to export! Please generate some music recommendations first.');
      return;
    }

    try {
      // Initialize PDF document
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      let yPosition = 25;

      // Helper function to add decorative lines
      const addDecorativeLine = (y, style = 'solid') => {
        pdf.setLineWidth(0.5);
        if (style === 'dashed') {
          pdf.setLineDashPattern([2, 2], 0);
        } else {
          pdf.setLineDashPattern([], 0);
        }
        pdf.line(margin, y, pageWidth - margin, y);
      };

      // Helper function to check if new page is needed
      const checkPageBreak = (neededSpace = 20) => {
        if (yPosition + neededSpace > pageHeight - 30) {
          pdf.addPage();
          yPosition = 25;
          return true;
        }
        return false;
      };

      // Create header with dark background
      pdf.setFillColor(30, 30, 30);
      pdf.rect(0, 0, pageWidth, 35, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('MusicAI Playlist', pageWidth / 2, 20, { align: 'center' });

      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text('AI-Powered Music Discovery & Recommendation', pageWidth / 2, 28, { align: 'center' });

      pdf.setTextColor(0, 0, 0);
      yPosition = 50;

      // Add playlist information section
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Playlist Information', margin, yPosition);
      yPosition += 8;

      addDecorativeLine(yPosition);
      yPosition += 10;

      // Generate playlist metadata
      const currentDate = new Date();
      const playlistInfo = [
        { label: 'Mood/Vibe:', value: mood ? mood.charAt(0).toUpperCase() + mood.slice(1) : 'Custom Selection' },
        { label: 'Generated:', value: currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) },
        { label: 'Time:', value: currentDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
        { label: 'Total Tracks:', value: `${songs.length} songs` },
        { label: 'Est. Duration:', value: `${Math.round(songs.length * 3.5)} minutes (${Math.round(songs.length * 3.5 / 60)} hours)` },
        { label: 'Match Quality:', value: 'AI-Optimized Selection' },
        { label: 'Platform:', value: 'Spotify Integration' }
      ];

      // Add playlist info in two-column layout
      pdf.setFontSize(10);
      playlistInfo.forEach((info, index) => {
        if (index % 2 === 0) {
          pdf.setFont('helvetica', 'bold');
          pdf.text(info.label, margin, yPosition);
          pdf.setFont('helvetica', 'normal');
          pdf.text(info.value, margin + 35, yPosition);
        } else {
          pdf.setFont('helvetica', 'bold');
          pdf.text(info.label, pageWidth / 2 + 10, yPosition);
          pdf.setFont('helvetica', 'normal');
          pdf.text(info.value, pageWidth / 2 + 45, yPosition);
          yPosition += 6;
        }
      });

      yPosition += 15;

      // Add music analysis section
      checkPageBreak(30);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Music Analysis', margin, yPosition);
      yPosition += 8;

      addDecorativeLine(yPosition);
      yPosition += 10;

      // Extract and display top artists
      const artists = [...new Set(songs.map(song => song.artist))];
      const topArtists = artists.slice(0, 5);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Featured Artists:', margin, yPosition);
      yPosition += 6;

      pdf.setFont('helvetica', 'normal');
      topArtists.forEach((artist, index) => {
        const artistCount = songs.filter(song => song.artist === artist).length;
        pdf.text(`${index + 1}. ${artist} (${artistCount} track${artistCount > 1 ? 's' : ''})`, margin + 5, yPosition);
        yPosition += 5;
      });

      if (artists.length > 5) {
        pdf.setFont('helvetica', 'italic');
        pdf.text(`... and ${artists.length - 5} more artists`, margin + 5, yPosition);
        yPosition += 5;
      }

      yPosition += 10;

      // Add complete track listing
      checkPageBreak(25);
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Complete Track Listing', margin, yPosition);
      yPosition += 8;

      addDecorativeLine(yPosition);
      yPosition += 12;

      // List all songs with formatting
      songs.forEach((song, index) => {
        checkPageBreak(25);

        // Add track number background
        pdf.setFillColor(240, 240, 240);
        pdf.roundedRect(margin, yPosition - 4, 12, 8, 2, 2, 'F');

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(60, 60, 60);
        pdf.text(`${index + 1}`, margin + 6, yPosition, { align: 'center' });

        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'bold');
        const titleText = song.title.length > 45 ? song.title.substring(0, 42) + '...' : song.title;
        pdf.text(titleText, margin + 18, yPosition);

        yPosition += 6;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(80, 80, 80);
        const artistText = song.artist.length > 50 ? song.artist.substring(0, 47) + '...' : song.artist;
        pdf.text(`${artistText}`, margin + 18, yPosition);

        yPosition += 5;

        if (song.url) {
          pdf.setFontSize(8);
          pdf.setFont('helvetica', 'italic');
          pdf.setTextColor(120, 120, 120);
          pdf.text(`${song.url.length > 60 ? song.url.substring(0, 57) + '...' : song.url}`, margin + 18, yPosition);
          yPosition += 4;
        }

        if (index < songs.length - 1) {
          pdf.setDrawColor(220, 220, 220);
          addDecorativeLine(yPosition + 2, 'dashed');
          yPosition += 6;
        } else {
          yPosition += 4;
        }
      });

      checkPageBreak(35);
      yPosition += 10;
      addDecorativeLine(yPosition);
      yPosition += 10;

      pdf.setFillColor(250, 250, 250);
      pdf.rect(margin, yPosition, contentWidth, 25, 'F');

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(60, 60, 60);
      pdf.text('Listening Tips:', margin + 5, yPosition + 8);

      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      const tips = [
        '• Create a Spotify playlist by copying these track links',
        '• Share this playlist with friends who have similar music taste',
        '• Use MusicAI again with different moods for variety'
      ];

      tips.forEach((tip, index) => {
        pdf.text(tip, margin + 5, yPosition + 12 + (index * 4));
      });

      const finalFooterY = pageHeight - 15;
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'italic');
      pdf.setTextColor(150, 150, 150);
      pdf.text('Generated by MusicAI - Intelligent Music Discovery Platform', pageWidth / 2, finalFooterY - 5, { align: 'center' });
      pdf.text(`Visit us for more personalized recommendations • Generated at ${currentDate.toISOString()}`, pageWidth / 2, finalFooterY, { align: 'center' });

      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
      }

      const timeStamp = currentDate.toISOString().replace(/[:.]/g, '-').split('T')[0];
      const moodSlug = mood ? mood.replace(/[^a-zA-Z0-9]/g, '_') : 'Custom';
      const fileName = `MusicAI_Playlist_${moodSlug}_${songs.length}tracks_${timeStamp}.pdf`;

      pdf.save(fileName);

      console.log(`PDF exported successfully: ${fileName}`);
      alert(`Playlist exported successfully!\n\nFile: ${fileName}\nSongs: ${songs.length}\nDuration: ~${Math.round(songs.length * 3.5)} minutes`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(`Failed to generate PDF: ${error.message}\n\nPlease try again or contact support if the issue persists.`);
    }
  };

  const handleFindMoreSongs = () => {
    if (onFindMoreSongs) {
      onFindMoreSongs();
    }
  };

  return (
    <div className="desktop-song-suggestions fade-in">
      <Container fluid>
        <div className="results-header">
          <Row className="justify-content-center">
            <Col lg={8} className="text-center">
              <h2 className="results-title">
                Your {mood ? `${mood.charAt(0).toUpperCase() + mood.slice(1)}` : 'Personalized'} Playlist
              </h2>
              <p className="results-subtitle">
                {songs.length} curated songs matching your energy
              </p>
              <div className="results-divider" />
            </Col>
          </Row>
        </div>

        <div className="desktop-song-grid">
          <Row xs={1} sm={2} lg={3} xl={4} xxl={5} className="g-4">
            {songs.map((song, index) => (
              <Col key={song.id} className="d-flex">
                <div 
                  className="desktop-song-card slide-in"
                  style={{ animationDelay: `${index * 0.08}s`, animationFillMode: 'both' }}
                >
                  <div className="desktop-album-cover">
                    {song.albumImageUrl && (
                      <>
                        <img
                          src={song.albumImageUrl}
                          alt={`${song.title} album cover`}
                          className="album-image"
                        />
                        <div className="album-overlay">
                          <div className="play-button">
                            <span></span>
                          </div>
                        </div>
                        <div className="track-number">
                          #{index + 1}
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="desktop-song-info">
                    <h4 className="song-title" title={song.title}>
                      {song.title}
                    </h4>
                    
                    <p className="song-artist" title={song.artist}>
                      <span className="artist-icon"></span>
                      {song.artist}
                    </p>
                    
                    <a
                      href={song.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="desktop-play-btn"
                    >
                      <span className="btn-icon"></span>
                      <span className="btn-text">Listen on Spotify</span>
                      <div className="btn-shine"></div>
                    </a>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div className="playlist-actions">
          <Row className="justify-content-center">
            <Col lg={6} className="text-center">
              <div className="action-buttons">
                <button 
                  className="action-btn secondary"
                  onClick={handleExportPlaylist}
                  title="Download playlist as PDF file"
                >
                  Export Playlist
                </button>
                <button 
                  className="action-btn primary"
                  onClick={handleFindMoreSongs}
                  title="Find more songs with different mood"
                >
                  Find More Songs
                </button>
              </div>
              <p className="playlist-stats">
                Total Duration: ~{Math.round(songs.length * 3.5)} minutes • 
                {songs.length} tracks discovered
              </p>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default SongSuggestions;
