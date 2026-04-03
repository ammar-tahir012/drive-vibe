import axios from 'axios';

const GEODB_API_KEY = import.meta.env.VITE_GEODB_API_KEY;
const BASE_URL = 'https://wft-geo-db.p.rapidapi.com/v1/geo/cities';

/**
 * Searches for cities using GeoDB Cities API.
 * @param {string} query - The city name prefix.
 * @returns {Promise<Array>} A list of city objects.
 */
export async function searchCities(query) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        namePrefix: query,
        limit: 8,
        sort: '-population',
      },
      headers: {
        'X-RapidAPI-Key': GEODB_API_KEY,
        'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
      },
    });

    return response.data.data.map((city) => ({
      city: city.city,
      country: city.country,
      countryCode: city.countryCode,
      population: city.population,
    }));
  } catch (error) {
    console.error('GeoDB Cities search failed:', error);
    return [];
  }
}
