import axios from 'axios';

const RADIO_API_URLS = [
  'https://de1.api.radio-browser.info/json/stations/bycountrycode',
  'https://de2.api.radio-browser.info/json/stations/bycountrycode',
];

/**
 * Fetches top radio stations for a specific country.
 * @param {string} countryCode - The country code (e.g., 'IN', 'US').
 * @returns {Promise<Array>} A list of radio station objects.
 */
export async function fetchRadioStations(countryCode) {
  for (const baseUrl of RADIO_API_URLS) {
    try {
      const response = await axios.get(`${baseUrl}/${countryCode}`, {
        params: {
          limit: 10,
          hidebroken: true,
          order: 'clickcount',
          reverse: true,
        },
      });

      return response.data.map((station) => ({
        name: station.name,
        url: station.url_resolved,
      }));
    } catch (error) {
      console.warn(`Radio API failed on ${baseUrl}:`, error);
      // Continue to fallback
    }
  }

  console.error('All radio APIs failed.');
  return [];
}
