const express = require("express");
const kanagataController = require("../../controllers/production/kanagata");
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const router = express.Router();

router.get(
  "/",
  authMiddleware.authenticateToken,
  kanagataController.getKanagata
);

router.post(
  "/",
  authMiddleware.authenticateToken,
  [
    check("id_kanagata").not().isEmpty().withMessage("ID kanagata is required"),
    check("actual_shot")
      .not()
      .isEmpty()
      .withMessage("Actual shot is required")
      .isNumeric()
      .withMessage("Actual shot must be a number"),
    check("cavity")
      .not()
      .isEmpty()
      .withMessage("Cavity is required")
      .isNumeric()
      .withMessage("Cavity must be a number"),
    check("limit_shot")
      .not()
      .isEmpty()
      .withMessage("Limit shot is required")
      .isNumeric()
      .withMessage("Limit shot must be a number"),
  ],
  kanagataController.createKanagata
);

router.patch(
  "/:id",
  authMiddleware.authenticateToken,
  [
    check("actual_shot")
      .not()
      .isEmpty()
      .withMessage("Actual shot is required")
      .isNumeric()
      .withMessage("Actual shot must be a number"),
    check("cavity")
      .not()
      .isEmpty()
      .withMessage("Cavity is required")
      .isNumeric()
      .withMessage("Cavity must be a number"),
    check("limit_shot")
      .not()
      .isEmpty()
      .withMessage("Limit shot is required")
      .isNumeric()
      .withMessage("Limit shot must be a number"),
  ],
  kanagataController.updateKanagata
);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  kanagataController.deleteKanagata
);

module.exports = router;
