import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * Rock-solid, verified, embed-friendly 4K drives from the world's most stable POV channels.
 * These are hand-picked to avoid restrictions and provide high-quality continuous loops.
 */
const MOCK_DRIVING_VIDEOS = [
  { videoId: '3S76D3Lsr9c', title: 'Tokyo Night Drive — 4K POV Uncut', thumbnail: 'https://i.ytimg.com/vi/3S76D3Lsr9c/sddefault.jpg', channelName: 'Rambalac' },
  { videoId: 'V94wN6hF9mU', title: 'Paris City Drive — Cinematic POV No Cuts', thumbnail: 'https://i.ytimg.com/vi/V94wN6hF9mU/sddefault.jpg', channelName: 'JvB 4K' },
  { videoId: 'Fsz_L69_Cmk', title: 'New York Manhattan — Afternoon Drive Uncut', thumbnail: 'https://i.ytimg.com/vi/Fsz_L69_Cmk/sddefault.jpg', channelName: 'ActionKid' },
  { videoId: 'lToD_XG_4kM', title: 'London Central — Cinematic POV Uncut', thumbnail: 'https://i.ytimg.com/vi/lToD_XG_4kM/sddefault.jpg', channelName: 'Driving World' },
];

/**
 * Searches for driving POV videos on YouTube.
 * @param {string} cityName - The name of the city to search for.
 * @param {boolean} isFallback - Whether this is a second-chance broader search.
 * @returns {Promise<Array>} A list of video objects.
 */
export async function searchDrivingVideos(cityName, isFallback = false) {
  // If Key is placeholder/invalid, return mock pool immediately
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_key_here' || YOUTUBE_API_KEY === '') {
    return MOCK_DRIVING_VIDEOS;
  }

  try {
    // Relaxed query slightly while keeping the "no-cuts" intent
    const query = isFallback 
      ? `intitle:"${cityName} driving"` 
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
      return MOCK_DRIVING_VIDEOS;
    }

    // Filter and map to ensure we have valid video IDs and reliable thumbnails
    return response.data.items
      .filter(item => item.id && item.id.videoId)
      .map((item) => {
        const videoId = item.id.videoId;
        return {
          videoId: videoId,
          title: item.snippet.title,
          // Use sddefault as it's the absolute safest resolution for compatibility
          thumbnail: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
          channelName: item.snippet.channelTitle,
        };
      });
  } catch (error) {
    console.warn('YouTube search failed (quota/key/throttled), switching to rock-solid mock pool.');
    return MOCK_DRIVING_VIDEOS;
  }
}
