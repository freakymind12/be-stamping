const express = require("express");
const machineController = require("../../controllers/production/machine");
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const router = express.Router();

router.get("/", authMiddleware.authenticateToken, machineController.getMachine);
router.post(
  "/",
  authMiddleware.authenticateToken,
  [
    check("id_machine", "id_machine is required").not().isEmpty(),
    check("address", "address is required").not().isEmpty(),
  ],
  machineController.createMachine
);

router.patch(
  "/:id",
  authMiddleware.authenticateToken,
  machineController.updateMachine
);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  machineController.deleteMachine
);

module.exports = router;
