const { handleError, handleResponse } = require("../../utils/responseUtils");
const redisClient = require("../../config/redis")
const { getLatestUsdExchangeRate } = require("../../services/getLastestExchangeRate")

const exchangeRatesController = {
  get: async (req, res) => {
    try {
      let exchangeRates = await redisClient.get("exchange-rates");

      if (exchangeRates) {
        exchangeRates = JSON.parse(exchangeRates);
        return handleResponse(res, "Success", 200, exchangeRates);
      }
      
      const newExchangeRates = await getLatestUsdExchangeRate();

      if (!newExchangeRates) {
        return handleError(res, "Failed to fetch new exchange rates", 500);
      }
      
      return handleResponse(res, "Success", 200, newExchangeRates);

    } catch (error) {
      handleError(res, error);
    }
  },
};

module.exports = exchangeRatesController