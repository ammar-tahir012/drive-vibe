import axios from 'axios';

const RADIO_API_BASE = 'https://de1.api.radio-browser.info/json/stations/search';

/**
 * Fetches top radio stations for a specific country.
 * Uses the /search endpoint with countrycode parameter (the old /bycountrycode/ path returns 404).
 * Filters for MP3 codec stations which have best browser compatibility.
 * @param {string} countryCode - The country code (e.g., 'FR', 'US', 'JP').
 * @returns {Promise<Array>} A list of radio station objects.
 */
export async function fetchRadioStations(countryCode) {
  try {
    const response = await axios.get(RADIO_API_BASE, {
      params: {
        countrycode: countryCode,
        limit: 20,
        hidebroken: true,
        order: 'clickcount',
        reverse: true,
        codec: 'MP3',
        has_extended_info: false,
      },
    });

    if (!response.data || response.data.length === 0) {
      console.warn(`No MP3 stations found for ${countryCode}, trying without codec filter...`);
      // Retry without codec filter
      const retry = await axios.get(RADIO_API_BASE, {
        params: {
          countrycode: countryCode,
          limit: 20,
          hidebroken: true,
          order: 'clickcount',
          reverse: true,
        },
      });
      return (retry.data || []).map((station) => ({
        name: station.name,
        url: station.url_resolved || station.url,
      }));
    }

    return response.data.map((station) => ({
      name: station.name,
      url: station.url_resolved || station.url,
    }));
  } catch (error) {
    console.error('Radio API failed:', error.message);
    return [];
  }
}
