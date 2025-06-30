/**
 * Spotify API Service
 * Handles authentication and music fetching from Spotify Web API
 * Uses local proxy server to avoid CORS issues
 */

import axios from 'axios';

/* ************************************************************************* */
/*                           ♫  CONFIGURATION  ♫                           */
/* ************************************************************************* */

// Proxy server configuration
const PROXY_BASE_URL = 'http://localhost:3001/api/spotify';

// In-memory cache for search results to reduce API calls
const cache = new Map();

/* ************************************************************************* */
/*                            ♫  BLOCK LIST  ♫                              */
/* ************************************************************************* */

// Keywords to filter out from search results
// Includes genres and potentially problematic content
const BLOCKED_KEYWORDS = [
  'happy birthday',
  // Music genres and categories
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

/**
 * Main function to fetch songs by mood/genre
 * Searches playlists and extracts tracks matching the mood
 * @param {string} mood - The mood/genre to search for
 * @param {string} market - Spotify market (default: 'US')
 * @param {number} playlistLimit - Number of playlists to search (default: 5)
 * @param {number} trackLimit - Number of tracks per playlist (default: 10)
 * @returns {Array} Array of track objects
 */
export const fetchSongsByMood = async (
  mood,
  market = 'US',
  playlistLimit = 5,
  trackLimit = 10
) => {
  const key = `${mood}_${market}`;
  
  // Return cached results if available
  if (cache.has(key)) {
    return cache.get(key);
  }

  try {
    console.log('Fetching songs for mood:', mood);
    
    // Step 1: Search for playlists matching the mood using proxy
    const { data: searchData } = await axios.get(
      `${PROXY_BASE_URL}/search`,
      {
        params: { q: mood, type: 'playlist', limit: playlistLimit, market },
      }
    );

    // Safely extract playlists array
    const playlists = Array.isArray(searchData.playlists?.items)
      ? searchData.playlists.items
      : [];

    console.log('Found playlists:', playlists.length);

    const tracks = [];

    // Step 2: Fetch tracks from each playlist in parallel using proxy
    await Promise.all(
      playlists.map(async (pl) => {
        if (!pl?.id) return; // Skip invalid playlists

        try {
          const { data: trackData } = await axios.get(
            `${PROXY_BASE_URL}/playlists/${pl.id}/tracks`,
            { params: { limit: trackLimit, market } }
          );

          // Process each track item
          (trackData.items || []).forEach((item) => {
            const t = item.track;
            if (!t?.id) return; // Skip invalid tracks

            const name = t.name.toLowerCase();
            // Filter out blocked keywords
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

    // Step 3: Remove duplicates and cache results
    const uniqueTracks = Array.from(
      new Map(tracks.map((t) => [t.id, t])).values()
    );
    
    console.log('Total unique tracks found:', uniqueTracks.length);
    cache.set(key, uniqueTracks);
    return uniqueTracks;
  } catch (err) {
    console.error('Error fetching songs:', err);
    console.error('Error details:', err.response?.data);
    return [];
  }
};
