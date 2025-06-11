const express = require("express");
const statusController = require("../../controllers/production/status");
const authMiddleware = require("../../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware.authenticateToken, statusController.getStatus);

module.exports = router;
