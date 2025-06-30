/**
 * Spotify API Service
 * Handles music fetching by calling our Netlify Function, which acts as a proxy.
 */

import axios from 'axios';

/* ************************************************************************* */
/*                           ♫  CONFIGURATION  ♫                           */
/* ************************************************************************* */

// The base path for our Netlify Function endpoint, rewritten by netlify.toml
const API_BASE_URL = '/api/spotify';

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
  const cacheKey = `${mood}_${market}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  try {
    // Step 1: Search for playlists using our Netlify Function proxy
    const { data: searchData } = await axios.get(`${API_BASE_URL}/search`, {
      params: { q: mood, type: 'playlist', limit: playlistLimit, market },
    });

    const playlists = searchData.playlists?.items || [];
    const trackPromises = playlists.map(async (playlist) => {
      if (!playlist?.id) return [];

      try {
        // Step 2: Fetch tracks for each playlist using our proxy
        const { data: trackData } = await axios.get(
          `${API_BASE_URL}/playlists/${playlist.id}/tracks`, {
            params: { limit: trackLimit, market },
          }
        );

        return (trackData.items || [])
          .map(({ track }) => {
            if (!track?.id || BLOCKED_KEYWORDS.some(kw => track.name.toLowerCase().includes(kw))) {
              return null;
            }
            return {
              id: track.id,
              title: track.name,
              artist: track.artists.map((a) => a.name).join(', '),
              url: track.external_urls.spotify,
              preview_url: track.preview_url,
              albumImageUrl: track.album.images[0]?.url || '',
            };
          })
          .filter(Boolean); // Filter out null tracks
      } catch (error) {
        console.warn(`Failed to fetch tracks from playlist ${playlist.id}:`, error);
        return [];
      }
    });

    const nestedTracks = await Promise.all(trackPromises);
    const tracks = nestedTracks.flat();

    // Step 3: Remove duplicates and cache results
    const uniqueTracks = Array.from(new Map(tracks.map((t) => [t.id, t])).values());
    cache.set(cacheKey, uniqueTracks);
    return uniqueTracks;

  } catch (error) {
    console.error('Error fetching songs via Netlify Function:', error.response ? error.response.data : error);
    return [];
  }
};
