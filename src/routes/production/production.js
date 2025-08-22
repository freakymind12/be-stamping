const express = require("express");
const productionController = require("../../controllers/production/production");
const authMiddleware = require("../../middleware/auth");
const { query, check } = require("express-validator");
const { cacheMiddleware, invalidateCacheMiddleware } = require("../../middleware/cacheMiddleware");
const router = express.Router();

router.post(
  "/",
  authMiddleware.authenticateToken,
  [
    check("id_pca").not().isEmpty().withMessage("id_pca is required"),
    // check("id_plan").not().isEmpty().withMessage("id_plan is required"),
    check("ok")
      .not()
      .isEmpty()
      .withMessage("ok is required")
      .isNumeric()
      .withMessage("ok must be a number"),
    check("ng")
      .not()
      .isEmpty()
      .withMessage("rip is required")
      .isNumeric()
      .withMessage("rip must be a number"),
    check("reject_setting")
      .not()
      .isEmpty()
      .withMessage("reject_setting is required")
      .isNumeric()
      .withMessage("reject_setting must be a number"),
    check("dummy")
      .not()
      .isEmpty()
      .withMessage("dummy is required")
      .isNumeric()
      .withMessage("dummy must be a number"),
    check("stop_time")
      .not()
      .isEmpty()
      .withMessage("stop_time is required")
      .isNumeric()
      .withMessage("stop_time must be a number"),
    check("production_time")
      .not()
      .isEmpty()
      .withMessage("production_time is required")
      .isNumeric()
      .withMessage("production_time must be a number"),
    check("dandori_time")
      .not()
      .isEmpty()
      .withMessage("dandori_time is required")
      .isNumeric()
      .withMessage("dandori_time must be a number"),
    check("shift").not().isEmpty().withMessage("shift is required"),
    check("date").not().isEmpty().withMessage("date is required"),
  ],
  productionController.createProduction
);

router.get(
  "/",
  authMiddleware.authenticateToken,
  productionController.getProduction
);

router.get(
  "/trend",
  authMiddleware.authenticateToken,
  [
    query("start", "start date is required").not().isEmpty(),
    query("end", "end date is required").not().isEmpty(),
    query("id_machine", "machine is required").not().isEmpty(),
  ],
  productionController.getTrendProduction
);

router.get(
  "/ppm",
  [
    query("start", "start date is required").not().isEmpty(),
    query("end", "end date is required").not().isEmpty(),
    query("id_machine", "machine is required").not().isEmpty(),
  ],
  authMiddleware.authenticateToken,
  productionController.getPpmStatistic
);

router.get(
  "/oee",
  [
    query("id_machine", "machine is required").not().isEmpty(),
    query("year", "year is required").not().isEmpty(),
    query("month", "month is required").not().isEmpty(),
  ],

  authMiddleware.authenticateToken,
  productionController.getOeeStatistic
);

router.get(
  "/monthly",
  authMiddleware.authenticateToken,
  productionController.getProductionMonthly
);

router.get(
  "/monthly/oee",
  [
    query("id_machine", "machine is required").not().isEmpty(),
    query("year", "year is required").not().isEmpty(),
    query("month", "month is required").not().isEmpty(),
  ],
  authMiddleware.authenticateToken,
  productionController.getMonthlyOee
);

router.get(
  "/fiscal",
  [query("year", "year is required").not().isEmpty()],
  authMiddleware.authenticateToken,
  productionController.getProductionFiscal
);

router.get(
  "/fiscal-sales",
  [query("year", "year is required").not().isEmpty()],
  authMiddleware.authenticateToken,
  productionController.getSalesandRejectCost
);

router.patch(
  "/:id",
  authMiddleware.authenticateToken,
  productionController.updateProduction
);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  productionController.deleteProduction
);

module.exports = router;
