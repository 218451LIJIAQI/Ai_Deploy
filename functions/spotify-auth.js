/**
 * Netlify Function: Secure Spotify Authentication Handler
 * Protects CLIENT_SECRET on the backend
 */

exports.handler = async (event, context) => {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Handle OPTIONS requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only handle POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // ✅ 使用统一的环境变量名称
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID || process.env.CLIENT_ID;
    const CLIENT_SECRET = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET || process.env.CLIENT_SECRET;
    
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.error('Missing Spotify credentials. Required: REACT_APP_SPOTIFY_CLIENT_ID and REACT_APP_SPOTIFY_CLIENT_SECRET');
      throw new Error('Spotify credentials not configured. Please set REACT_APP_SPOTIFY_CLIENT_ID and REACT_APP_SPOTIFY_CLIENT_SECRET environment variables.');
    }

    // Get Spotify access token
    const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
    
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Spotify API Error:', response.status, errorData);
      throw new Error(`Spotify authentication failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        access_token: data.access_token,
        expires_in: data.expires_in,
      }),
    };
  } catch (error) {
    console.error('Spotify auth error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal server error',
        message: error.message,
        details: 'Please check that REACT_APP_SPOTIFY_CLIENT_ID and REACT_APP_SPOTIFY_CLIENT_SECRET are configured correctly.'
      }),
    };
  }
}; 