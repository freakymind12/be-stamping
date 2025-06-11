const express = require("express");
const planController = require("../../controllers/production/plan");
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const router = express.Router();

router.get("/", authMiddleware.authenticateToken, planController.getPlan);
router.post(
  "/",
  authMiddleware.authenticateToken,
  [
    check("id_pca", "id_pca is required").not().isEmpty(),
    check("qty", "qty is required").not().isEmpty(),
    check("shift", "shift is required").not().isEmpty(),
    check("start", "start is required").not().isEmpty(),
    check("end", "end is required").not().isEmpty(),
  ],
  planController.createPlan
);
router.patch(
  "/:id",
  [
    check("id_pca", "id_pca is required").not().isEmpty(),
    check("qty", "qty is required").not().isEmpty(),
    check("shift", "shift is required").not().isEmpty(),
    check("start", "start is required").not().isEmpty(),
    check("end", "end is required").not().isEmpty(),
  ],
  authMiddleware.authenticateToken,
  planController.updatePlan
);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  planController.deletePlan
);

module.exports = router;
