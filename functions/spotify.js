const axios = require('axios');

const {
  REACT_APP_SPOTIFY_CLIENT_ID,
  REACT_APP_SPOTIFY_CLIENT_SECRET
} = process.env;

// A cache for the access token
let tokenCache = {
  accessToken: null,
  expiresAt: 0,
};

/**
 * Gets a new access token from Spotify if the cached one is expired.
 */
async function getAccessToken() {
  if (tokenCache.accessToken && Date.now() < tokenCache.expiresAt) {
    return tokenCache.accessToken;
  }

  const basicAuth = Buffer.from(
    `${REACT_APP_SPOTIFY_CLIENT_ID}:${REACT_APP_SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');

  try {
    const { data } = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials', {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
      }
    );

    // Cache the new token and its expiry time (with a 60-second buffer)
    tokenCache.accessToken = data.access_token;
    tokenCache.expiresAt = Date.now() + (data.expires_in - 60) * 1000;

    return tokenCache.accessToken;
  } catch (error) {
    console.error('Error fetching Spotify token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to retrieve Spotify access token.');
  }
}

/**
 * The main handler for the Netlify Function.
 * It acts as a proxy to the Spotify API.
 */
exports.handler = async (event, context) => {
  const { path, httpMethod, queryStringParameters } = event;

  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed',
    };
  }

  try {
    const accessToken = await getAccessToken();
    const apiPath = path.replace('/.netlify/functions/spotify', '');
    const spotifyApiUrl = `https://api.spotify.com/v1${apiPath}`;

    const { data } = await axios.get(spotifyApiUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: queryStringParameters,
    });

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Spotify API proxy error:', error);
    return {
      statusCode: error.response ? error.response.status : 500,
      body: JSON.stringify({
        error: 'Failed to fetch data from Spotify API.',
        details: error.response ? error.response.data : null,
      }),
    };
  }
}; 