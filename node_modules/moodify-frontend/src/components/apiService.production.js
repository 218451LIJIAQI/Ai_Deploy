/**
 * Production API Service for Netlify Deployment
 * Uses Netlify Functions to securely handle Spotify authentication
 */

import axios from 'axios';

/* ************************************************************************* */
/*                           ♫  CONFIGURATION  ♫                           */
/* ************************************************************************* */

// Spotify API Configuration
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;

// Token management
let accessToken = null;
let tokenExpiresAt = 0;

// Cache for search results
const cache = new Map();

/* ************************************************************************* */
/*                      ♫  AUTHENTICATION & TOKEN  ♫                        */
/* ************************************************************************* */

/**
 * Securely obtain Spotify access token using Netlify Functions
 */
const authenticateSpotify = async () => {
  // Return cached token if still valid
  if (accessToken && Date.now() < tokenExpiresAt - 60 * 1000) {
    return accessToken;
  }

  try {
    const { data } = await axios.post('/.netlify/functions/spotify-auth');
    
    accessToken = data.access_token;
    tokenExpiresAt = Date.now() + data.expires_in * 1000;
    return accessToken;
  } catch (err) {
    console.error('Spotify authentication failed:', err);
    throw new Error('Spotify authentication failed');
  }
};

/* ************************************************************************* */
/*                            ♫  BLOCK LIST  ♫                              */
/* ************************************************************************* */

const BLOCKED_KEYWORDS = [
  'happy birthday',
  'acoustic', 'afrobeat', 'alt-rock', 'alternative', 'ambient', 'anime',
  'black-metal', 'bluegrass', 'blues', 'bossanova', 'brazil', 'breakbeat',
  'british', 'cantopop', 'chicago-house', 'children', 'chill', 'classical',
  'club', 'comedy', 'country', 'dance', 'dancehall', 'death-metal',
  'deep-house', 'detroit-techno', 'disco', 'disney', 'drum-and-bass', 'dub',
  'dubstep', 'edm', 'electro', 'electronic', 'emo', 'folk', 'forro', 'french',
  'funk', 'garage', 'german', 'gospel', 'goth', 'grindcore', 'groove',
  'grunge', 'guitar', 'happy', 'hard-rock', 'hardcore', 'hardstyle',
  'heavy-metal', 'hip-hop', 'holidays', 'honky-tonk', 'house', 'idm',
  'indian', 'indie', 'indie-pop', 'industrial', 'iranian', 'j-dance',
  'j-idol', 'j-pop', 'j-rock', 'jazz', 'k-pop', 'kids', 'latin', 'latino',
  'malay', 'mandopop', 'metal', 'metal-misc', 'metalcore', 'minimal-techno',
  'movies', 'mpb', 'new-age', 'new-release', 'opera', 'pagode', 'party',
  'philippines-opm', 'piano', 'pop', 'pop-film', 'post-dubstep', 'power-pop',
  'progressive-house', 'psych-rock', 'punk', 'punk-rock', 'r-n-b', 'rainy-day',
  'reggae', 'reggaeton', 'road-trip', 'rock', 'rock-n-roll', 'rockabilly',
  'romance', 'sad', 'salsa', 'samba', 'sertanejo', 'show-tunes',
  'singer-songwriter', 'ska', 'sleep', 'songwriter', 'soul', 'soundtracks',
  'spanish', 'study', 'summer', 'swedish', 'synth-pop', 'tango', 'techno',
  'trance', 'trip-hop', 'turkish', 'work-out', 'world-music',
];

/* ************************************************************************* */
/*                        ♫  MAIN FETCH FUNCTION  ♫                         */
/* ************************************************************************* */

export const fetchSongsByMood = async (
  mood,
  market = 'US',
  playlistLimit = 5,
  trackLimit = 10
) => {
  const key = `${mood}_${market}`;
  
  if (cache.has(key)) {
    return cache.get(key);
  }

  await authenticateSpotify();
  const headers = { Authorization: `Bearer ${accessToken}` };

  try {
    const { data: searchData } = await axios.get(
      'https://api.spotify.com/v1/search',
      {
        headers,
        params: { q: mood, type: 'playlist', limit: playlistLimit, market },
      }
    );

    const playlists = Array.isArray(searchData.playlists?.items)
      ? searchData.playlists.items
      : [];

    const tracks = [];

    await Promise.all(
      playlists.map(async (pl) => {
        if (!pl?.id) return;

        try {
          const { data: trackData } = await axios.get(
            `https://api.spotify.com/v1/playlists/${pl.id}/tracks`,
            { headers, params: { limit: trackLimit, market } }
          );

          (trackData.items || []).forEach((item) => {
            const t = item.track;
            if (!t?.id) return;

            const name = t.name.toLowerCase();
            if (BLOCKED_KEYWORDS.some((kw) => name.includes(kw))) return;

            tracks.push({
              id: t.id,
              title: t.name,
              artist: t.artists.map((a) => a.name).join(', '),
              url: t.external_urls.spotify,
              preview_url: t.preview_url,
              albumImageUrl: t.album.images[0]?.url || '',
            });
          });
        } catch (innerErr) {
          console.warn(`Failed to fetch tracks from playlist ${pl.id}:`, innerErr);
        }
      })
    );

    const uniqueTracks = Array.from(
      new Map(tracks.map((t) => [t.id, t])).values()
    );
    cache.set(key, uniqueTracks);
    return uniqueTracks;
  } catch (err) {
    console.error('Error fetching songs:', err);
    return [];
  }
}; 