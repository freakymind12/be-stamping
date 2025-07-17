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

router.get("/reset-code", authMiddleware.authenticateToken, kanagataController.getKanagataResetCode)

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

router.post("/reset-code", authMiddleware.authenticateToken, [
  check("code")
    .not().isEmpty().withMessage("Reset code is required")
    .isNumeric()
    .withMessage("Reset code must be numeric")
    .isLength({ min: 2, max: 2 })
    .withMessage("Reset code must be exactly 2 digits"),
  check("name").not().isEmpty().withMessage("Name kanagata part is required")
], kanagataController.createKanagataResetCode)

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

router.patch("/reset-code/:id", authMiddleware.authenticateToken, [
  check("code")
    .not().isEmpty().withMessage("Reset code is required")
    .isNumeric()
    .withMessage("Reset code must be numeric")
    .isLength({ min: 2, max: 2 })
    .withMessage("Reset code must be exactly 2 digits"),
  check("name").not().isEmpty().withMessage("Name kanagata part is required"),
  kanagataController.updateKanagataResetCode
])

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  kanagataController.deleteKanagata
);

router.delete("/reset-code/:id", authMiddleware.authenticateToken, kanagataController.deleteKanagataResetCode)

module.exports = router;
