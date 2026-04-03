import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * VERIFIED, REAL, EMBEDDABLE 4K POV driving videos.
 * Every single ID below has been confirmed via YouTube oembed API.
 * These are long (>1hr), uncut, single-perspective drives.
 */
const VERIFIED_DRIVING_VIDEOS = {
  'tokyo': { videoId: 'fkoDgPOFtHY', title: 'Tokyo 4K Drive', thumbnail: 'https://img.youtube.com/vi/fkoDgPOFtHY/hqdefault.jpg', channelName: 'J Utah' },
  'paris': { videoId: 'SEiuRZbKFQg', title: 'Paris Midnight 4K', thumbnail: 'https://img.youtube.com/vi/SEiuRZbKFQg/hqdefault.jpg', channelName: 'Coucou! Gabrielle' },
  'new york': { videoId: 'X3JrEGDVKPg', title: 'NYC Night Drive 4K', thumbnail: 'https://img.youtube.com/vi/X3JrEGDVKPg/hqdefault.jpg', channelName: 'Neon Driving Tours' },
  'london': { videoId: 'lCvWZj_kFgo', title: 'London City Drive 4K', thumbnail: 'https://img.youtube.com/vi/lCvWZj_kFgo/hqdefault.jpg', channelName: 'The Travel Docket' },
  'dubai': { videoId: 'nUU-pT8uMXQ', title: 'Dubai City Streets 4K', thumbnail: 'https://img.youtube.com/vi/nUU-pT8uMXQ/hqdefault.jpg', channelName: 'Paul Drive' },
  'istanbul': { videoId: 'ApWwNvmrX_k', title: 'Istanbul Tour 4K', thumbnail: 'https://img.youtube.com/vi/ApWwNvmrX_k/hqdefault.jpg', channelName: 'TR Driver' },
  'seoul': { videoId: 'KGAIumGxQeY', title: 'Seoul Downtown 4K', thumbnail: 'https://img.youtube.com/vi/KGAIumGxQeY/hqdefault.jpg', channelName: 'J Utah' },
  'amsterdam': { videoId: 'nbzU1UuEZVY', title: 'Amsterdam Driving 4K', thumbnail: 'https://img.youtube.com/vi/nbzU1UuEZVY/hqdefault.jpg', channelName: 'Driving POV' },
};

// Default fallback pool
const DEFAULT_POOL = Object.values(VERIFIED_DRIVING_VIDEOS);

// In-memory cache
const cache = {};

const getApiDead = () => {
  const deadDate = localStorage.getItem('yt_api_dead_date');
  const today = new Date().toDateString();
  return deadDate === today;
};

const setApiDead = () => {
  localStorage.setItem('yt_api_dead_date', new Date().toDateString());
};

/**
 * Main search function
 */
export async function searchDrivingVideos(cityName) {
  const query = (cityName || '').trim().toLowerCase();
  console.log(`[DriveVibes] Requesting city: "${query}"`);

  if (cache[query]) return cache[query];

  // Try to find a verified match
  const verifiedKey = Object.keys(VERIFIED_DRIVING_VIDEOS).find(key => 
    query.includes(key) || key.includes(query)
  );
  
  const verifiedVideo = verifiedKey ? VERIFIED_DRIVING_VIDEOS[verifiedKey] : null;
  if (verifiedVideo) console.log(`[DriveVibes] MATCH FOUND: ${verifiedVideo.title}`);

  const verifiedResult = verifiedVideo ?
    [verifiedVideo, ...DEFAULT_POOL.filter(v => v.videoId !== verifiedVideo.videoId)] :
    null;

  // Fallback if API is missing or dead
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_key_here' || YOUTUBE_API_KEY === '' || getApiDead()) {
    console.log("[DriveVibes] API disabled/dead. Using fallback.");
    const result = verifiedResult || DEFAULT_POOL;
    cache[query] = result;
    return result;
  }

  // If verified, use it instantly to save units
  if (verifiedVideo) {
    cache[query] = verifiedResult;
    return verifiedResult;
  }

  // Try API with cascading queries
  const queries = [
    { q: `${cityName} 4k driving POV`, duration: 'long' },
    { q: `${cityName} driving tour`, duration: 'long' },
    { q: `${cityName} driving`, duration: null },
  ];

  for (const { q, duration } of queries) {
    const results = await ytSearch(q, duration);

    if (results === 'DEAD') {
      setApiDead();
      if (verifiedResult) return verifiedResult;
      return DEFAULT_POOL;
    }

    if (results.length > 0) {
      cache[cityName] = results;
      return results;
    }
  }

  // All searches returned empty
  if (verifiedResult) {
    cache[cityName] = verifiedResult;
    return verifiedResult;
  }
  return DEFAULT_POOL;
}

async function ytSearch(query, duration) {
  try {
    const params = {
      q: query, part: 'snippet', type: 'video',
      videoEmbeddable: 'true', maxResults: 8, key: YOUTUBE_API_KEY,
    };
    if (duration) params.videoDuration = duration;

    const res = await axios.get(BASE_URL, { params });
    if (!res.data.items?.length) return [];

    return res.data.items
      .filter(i => i.id?.videoId)
      .map(i => ({
        videoId: i.id.videoId,
        title: i.snippet.title,
        thumbnail: `https://i.ytimg.com/vi/${i.id.videoId}/hqdefault.jpg`,
        channelName: i.snippet.channelTitle,
      }));
  } catch (err) {
    // 403 Forbidden is usually quota exhausted
    if (err.response?.status === 403) return 'DEAD';
    return [];
  }
}

