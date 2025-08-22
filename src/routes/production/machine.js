const express = require("express");
const machineController = require("../../controllers/production/machine");
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const { cacheMiddleware, invalidateCacheMiddleware } = require("../../middleware/cacheMiddleware");
const router = express.Router();

router.get("/", authMiddleware.authenticateToken, cacheMiddleware(60), machineController.getMachine);
router.post(
  "/",
  authMiddleware.authenticateToken,
  invalidateCacheMiddleware(),
  [
    check("id_machine", "id_machine is required").not().isEmpty(),
    check("address", "address is required").not().isEmpty(),
  ],
  machineController.createMachine
);

router.patch(
  "/:id",
  authMiddleware.authenticateToken,
  invalidateCacheMiddleware(),
  machineController.updateMachine
);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  invalidateCacheMiddleware(),
  machineController.deleteMachine
);

module.exports = router;
