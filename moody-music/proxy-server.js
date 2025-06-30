const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Spotify API credentials
const CLIENT_ID = '5c2486bdee15479987e649dff0db6123';
const CLIENT_SECRET = '4aedd01225ea4134a4ea0da043db0c1b';

// Token cache
let accessToken = null;
let tokenExpiresAt = 0;

// Get Spotify access token
async function getSpotifyToken() {
  if (accessToken && Date.now() < tokenExpiresAt - 60 * 1000) {
    return accessToken;
  }

  const basicAuth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'client_credentials');
    
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      formData,
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    accessToken = response.data.access_token;
    tokenExpiresAt = Date.now() + response.data.expires_in * 1000;
    return accessToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error.response?.data);
    throw error;
  }
}

// Proxy endpoint for Spotify search
app.get('/api/spotify/search', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const { q, type, limit, market } = req.query;
    
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { q, type, limit, market },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Search error:', error.response?.data);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Proxy endpoint for playlist tracks
app.get('/api/spotify/playlists/:id/tracks', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const { id } = req.params;
    const { limit, market } = req.query;
    
    const response = await axios.get(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: { limit, market },
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Playlist tracks error:', error.response?.data);
    res.status(500).json({ error: 'Failed to fetch playlist tracks' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
}); 