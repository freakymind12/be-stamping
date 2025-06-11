const express = require("express");
const maintenanceController = require("../../controllers/production/maintenance");
const authMiddleware = require("../../middleware/auth");
const { query } = require("express-validator");
const router = express.Router();

router.get(
  "/latest",
  [query("id_machine", "id_machine is required").not().isEmpty()],
  authMiddleware.authenticateToken,
  maintenanceController.getLatestMaintenancePart
);

router.get(
  "/history",
  [query("id_machine", "id_machine is required").not().isEmpty()],
  authMiddleware.authenticateToken,
  maintenanceController.getHistoryMaintenance
);

module.exports = router;
