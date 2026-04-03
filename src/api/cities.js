import axios from 'axios';

/**
 * Free city search using Open-Meteo Geocoding API.
 * No API key required. No rate limits.
 * Returns city name, country, and country code for any city worldwide.
 * 
 * @param {string} query - The city name to search for.
 * @returns {Promise<Array>} A list of city objects.
 */
export async function searchCities(query) {
  try {
    const response = await axios.get('https://geocoding-api.open-meteo.com/v1/search', {
      params: {
        name: query,
        count: 8,
        language: 'en',
      },
    });

    if (!response.data.results) return [];

    return response.data.results
      .filter(r => r.feature_code !== 'AIRP') // exclude airports
      .map((result) => ({
        city: result.name,
        country: result.country,
        countryCode: result.country_code,
        population: result.population || 0,
      }));
  } catch (error) {
    console.error('City search failed:', error);
    return [];
  }
}
