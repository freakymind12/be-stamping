const express = require("express");
const productController = require("../../controllers/production/product");
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const { cacheMiddleware, invalidateCacheMiddleware } = require("../../middleware/cacheMiddleware");
const router = express.Router();

router.get("/", authMiddleware.authenticateToken, productController.getProduct);
router.post(
  "/",
  authMiddleware.authenticateToken,
  [
    check("id_product", "id_product is required").not().isEmpty(),
    check("name", "name is required").not().isEmpty(),
    check("price")
      .not()
      .isEmpty()
      .withMessage("price cannot be empty")
      .isNumeric()
      .withMessage("price must be a number"),
  ],
  productController.createProduct
);

router.patch(
  "/:id",
  authMiddleware.authenticateToken,
  [
    check("id_product", "id_product is required").not().isEmpty(),
    check("name", "name is required").not().isEmpty(),
    check("price")
      .not()
      .isEmpty()
      .withMessage("price cannot be empty")
      .isNumeric()
      .withMessage("price must be a number"),
  ],
  productController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware.authenticateToken,
  productController.deleteProduct
);
module.exports = router;
