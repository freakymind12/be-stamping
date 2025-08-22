const express = require("express");
const problemController = require("../../controllers/production/problem");
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const { cacheMiddleware, invalidateCacheMiddleware } = require("../../middleware/cacheMiddleware");
const router = express.Router();

router.get("/", authMiddleware.authenticateToken, problemController.getProblem);
router.post(
  "/",
  authMiddleware.authenticateToken,
  [
    check("name", "name is required").not().isEmpty(),
    check("is_stop")
      .not()
      .isEmpty()
      .withMessage("is_stop cannot be empty")
      .isInt({ min: 0, max: 1 })
      .withMessage("is_stop must be either 0 or 1"),
  ],
  problemController.createProblem
);

router.patch(
  "/:id",
  authMiddleware.authenticateToken,
  [
    check("name", "name is required").not().isEmpty(),
    check("is_stop", "is_stop is required")
      .not()
      .isEmpty()
      .withMessage("is_stop cannot be empty")
      .isInt({ min: 0, max: 1 })
      .withMessage("is_stop must be either 0 or 1"),
  ],
  problemController.updateProblem
);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  problemController.deleteProblem
);

module.exports = router;
