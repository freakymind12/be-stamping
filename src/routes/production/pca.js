const express = require("express");
const pcaController = require("../../controllers/production/pca");
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const router = express.Router();

router.get("/", authMiddleware.authenticateToken, pcaController.getPca);
router.post(
  "/",
  authMiddleware.authenticateToken,
  [
    check("id_machine", "id_machine is required").not().isEmpty(),
    check("id_product", "id_product is required").not().isEmpty(),
    check("id_kanagata", "id_kanagata is required").not().isEmpty(),
    check("speed", "speed is required").not().isEmpty(),
  ],
  pcaController.createPca
);

router.patch("/:id", authMiddleware.authenticateToken, pcaController.updatePca);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  pcaController.deletePca
);

module.exports = router;