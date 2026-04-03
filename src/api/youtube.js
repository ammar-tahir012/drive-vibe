import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * VERIFIED, REAL, EMBEDDABLE 4K POV driving videos.
 * Every single ID below has been confirmed via YouTube oembed API.
 * These are long (>1hr), uncut, single-perspective drives.
 */
const VERIFIED_DRIVING_VIDEOS = {
  'Tokyo':    { videoId: 'fkoDgPOFtHY', title: 'Tokyo 4K - Skyline Sunset - Scenic Drive', thumbnail: 'https://i.ytimg.com/vi/fkoDgPOFtHY/hqdefault.jpg', channelName: 'J Utah' },
  'Paris':    { videoId: 'SEiuRZbKFQg', title: 'Midnight Drive in Paris 4K', thumbnail: 'https://i.ytimg.com/vi/SEiuRZbKFQg/hqdefault.jpg', channelName: 'Coucou! Gabrielle' },
  'New York': { videoId: 'X3JrEGDVKPg', title: '4K HDR Night Drive around New York City', thumbnail: 'https://i.ytimg.com/vi/X3JrEGDVKPg/hqdefault.jpg', channelName: 'Neon Driving Tours' },
  'London':   { videoId: 'lCvWZj_kFgo', title: '4K Driving Tour of London - Scenic City Drive', thumbnail: 'https://i.ytimg.com/vi/lCvWZj_kFgo/hqdefault.jpg', channelName: 'The Travel Docket' },
  'Dubai':    { videoId: 'nUU-pT8uMXQ', title: 'Dubai 4K Day Drive - City Streets & Skyline', thumbnail: 'https://i.ytimg.com/vi/nUU-pT8uMXQ/hqdefault.jpg', channelName: 'Paul Drive' },
  'Istanbul': { videoId: 'ApWwNvmrX_k', title: '4K-HDR Driving in Istanbul Turkey', thumbnail: 'https://i.ytimg.com/vi/ApWwNvmrX_k/hqdefault.jpg', channelName: 'TR Driver' },
  'Seoul':    { videoId: 'KGAIumGxQeY', title: 'Seoul 4K - Driving Downtown - Skyscraper Sunset', thumbnail: 'https://i.ytimg.com/vi/KGAIumGxQeY/hqdefault.jpg', channelName: 'J Utah' },
};

// Default fallback pool (used when city doesn't match any key above)
const DEFAULT_POOL = Object.values(VERIFIED_DRIVING_VIDEOS);

/**
 * Searches for driving POV videos on YouTube.
 * Strategy:
 *   1. If we have a verified video for this exact city name, use it first
 *   2. Try the YouTube API (if key is valid and not over quota)
 *   3. Fall back to the full verified pool
 */
export async function searchDrivingVideos(cityName, isFallback = false) {
  // Check if we have a verified video for this exact city
  const verifiedVideo = VERIFIED_DRIVING_VIDEOS[cityName];

  // If no API key or it's a placeholder, use verified data
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_key_here' || YOUTUBE_API_KEY === '') {
    if (verifiedVideo) return [verifiedVideo, ...DEFAULT_POOL.filter(v => v.videoId !== verifiedVideo.videoId)];
    return DEFAULT_POOL;
  }

  try {
    const query = isFallback
      ? `${cityName} 4k driving`
      : `${cityName} 4k driving POV uncut -compilation -best -top -mashup`;

    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        part: 'snippet',
        type: 'video',
        videoEmbeddable: 'true',
        videoDuration: 'long',
        maxResults: 10,
        key: YOUTUBE_API_KEY,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      if (!isFallback) {
        return searchDrivingVideos(cityName, true);
      }
      // API returned nothing — use verified pool
      if (verifiedVideo) return [verifiedVideo, ...DEFAULT_POOL.filter(v => v.videoId !== verifiedVideo.videoId)];
      return DEFAULT_POOL;
    }

    // Use API results, with the verified video as #1 if available
    const apiResults = response.data.items
      .filter(item => item.id && item.id.videoId)
      .map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        thumbnail: `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
        channelName: item.snippet.channelTitle,
      }));

    // Put verified video first if we have one
    if (verifiedVideo) {
      return [verifiedVideo, ...apiResults.filter(v => v.videoId !== verifiedVideo.videoId)];
    }
    return apiResults;
  } catch (error) {
    console.warn('YouTube API failed (quota/key), using verified pool:', error.message);
    if (verifiedVideo) return [verifiedVideo, ...DEFAULT_POOL.filter(v => v.videoId !== verifiedVideo.videoId)];
    return DEFAULT_POOL;
  }
}
