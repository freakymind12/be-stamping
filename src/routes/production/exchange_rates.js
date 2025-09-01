const express = require("express")
const exchangeRatesController = require("../../controllers/production/exchange_rates")
const authMiddleware = require("../../middleware/auth")
const router = express.Router()

router.get("/exchange-rates", authMiddleware.authenticateToken, exchangeRatesController.get)

module.exports = router