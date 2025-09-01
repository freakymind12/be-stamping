const axios = require('axios');
const redisClient = require("../config/redis")
/**
 * Mengambil data kurs USD terbaru dari API open.er-api.com
 * @returns {Promise<Object>} Data kurs dalam bentuk objek, atau null jika gagal
 */
async function getLatestUsdExchangeRate() {
  try {
    const cacheKey = "exchange-rates";
    // Cek apakah data sudah ada di cache
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Data kurs USD masih ada di cache, tidak melakukan request baru.");
      return JSON.parse(cachedData);
    }

    // Jika tidak ada di cache, lakukan request ke API
    const response = await axios.get('https://open.er-api.com/v6/latest/USD');
    if (response.status === 200 && response.data && response.data.result === "success") {
      // Ambil hanya key rates, time_last_update_utc, dan base_code dari response
      const { rates, time_last_update_utc, base_code } = response.data;

      // Simpan hasil ke Redis dengan waktu simpan 24 jam (86400 detik)
      const dataToCache = { rates, time_last_update_utc, base_code };
      await redisClient.setEx(cacheKey, 86400, JSON.stringify(dataToCache));
      console.log("Success update new exchange rates")
      return dataToCache
    } else {
      console.error('Failed get exchange rates data: invalid response');
      return null;
    }
  } catch (error) {
    console.error('Error while request to exchange rate API', error.message);
    return null;
  }
}

module.exports = {
  getLatestUsdExchangeRate
};
