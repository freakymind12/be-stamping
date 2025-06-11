const express = require("express");
const finalStatusController = require("../../controllers/production/final_status");
const authMiddleware = require("../../middleware/auth");
const { query } = require("express-validator");
const router = express.Router();

router.get(
  "/",
  authMiddleware.authenticateToken,
  [
    query("start", "start date is required").not().isEmpty(),
    query("end", "end date is required").not().isEmpty(),
    query("id_machine", "machine is required").not().isEmpty(),
  ],
  finalStatusController.getFinalStatus
);

module.exports = router;
