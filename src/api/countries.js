import axios from 'axios';

const BASE_URL = 'https://restcountries.com/v3.1/alpha';

/**
 * Fetches country information by country code.
 * @param {string} countryCode - The country code.
 * @returns {Promise<Object>} A country object.
 */
export async function getCountryByCode(countryCode) {
  try {
    const response = await axios.get(`${BASE_URL}/${countryCode}`);

    if (response.data && response.data.length > 0) {
      const countryData = response.data[0];
      return {
        name: countryData.name.common,
        flag: countryData.flag,
        flagUrl: countryData.flags.png,
        capital: countryData.capital ? countryData.capital[0] : 'N/A',
        region: countryData.region,
      };
    }
    return null;
  } catch (error) {
    console.error('REST Countries API failed:', error);
    return null;
  }
}
