import axios from 'axios';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3/search';

/**
 * Cinematic fallbacks for when the YouTube API fails or quotas are exceeded.
 */
const MOCK_DRIVING_VIDEOS = [
  { videoId: 'L6_eSBHxfwI', title: 'Tokyo Night Drive — 4K POV', thumbnail: 'https://img.youtube.com/vi/L6_eSBHxfwI/maxresdefault.jpg', channelName: 'DriveVibes Original' },
  { videoId: 'E_S_p9W924A', title: 'Paris Rainy Evening — Cinematic 4K', thumbnail: 'https://img.youtube.com/vi/E_S_p9W924A/maxresdefault.jpg', channelName: 'DriveVibes Original' },
  { videoId: '1-iS7LArMPA', title: 'New York City Streets — Afternoon Drive', thumbnail: 'https://img.youtube.com/vi/1-iS7LArMPA/maxresdefault.jpg', channelName: 'DriveVibes Original' },
  { videoId: 'Z-fF1r-h5M0', title: 'London Central — Cinematic POV', thumbnail: 'https://img.youtube.com/vi/Z-fF1r-h5M0/maxresdefault.jpg', channelName: 'DriveVibes Original' },
];

/**
 * Searches for driving POV videos on YouTube.
 * @param {string} cityName - The name of the city to search for.
 * @returns {Promise<Array>} A list of video objects.
 */
export async function searchDrivingVideos(cityName) {
  // If Key is placeholder, return mock data immediately
  if (!YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_key_here') {
    console.warn('Using YouTube Mock Data (API Key missing)');
    return MOCK_DRIVING_VIDEOS;
  }

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: `${cityName} driving tour`,
        part: 'snippet',
        type: 'video',
        maxResults: 10,
        key: YOUTUBE_API_KEY,
      },
    });

    if (!response.data.items || response.data.items.length === 0) {
      console.warn(`No YouTube results for ${cityName}, using mock data...`);
      return MOCK_DRIVING_VIDEOS;
    }

    return response.data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || '',
      channelName: item.snippet.channelTitle,
    }));
  } catch (error) {
    console.error('YouTube search failed (likely quota or key issue), falling back to mock data:', error);
    return MOCK_DRIVING_VIDEOS;
  }
}
