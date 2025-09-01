const express = require("express");
const supplierController = require("../../controllers/production/supplier");
const authMiddleware = require("../../middleware/auth");
const { check } = require("express-validator");
const { cacheMiddleware, invalidateCacheMiddleware } = require("../../middleware/cacheMiddleware");
const router = express.Router();

// GET - Mengambil data supplier
router.get("/", 
  authMiddleware.authenticateToken, 
  cacheMiddleware(60), 
  supplierController.getSupplier
);

// POST - Membuat supplier baru
router.post(
  "/",
  authMiddleware.authenticateToken,
  invalidateCacheMiddleware(),
  [
    check("name", "Name supplier is required").not().isEmpty(),
    check("location", "Location is required").not().isEmpty(),
  ],
  supplierController.createSupplier
);

// PATCH - Mengupdate supplier
router.patch(
  "/:id_supplier",
  authMiddleware.authenticateToken,
  invalidateCacheMiddleware(),
  [
    check("name", "Name supplier is required").not().isEmpty(),
    check("location", "Location is required").not().isEmpty(),
  ],
  supplierController.updateSupplier
);

// DELETE - Menghapus supplier
router.delete(
  "/:id_supplier",
  authMiddleware.authenticateToken,
  invalidateCacheMiddleware(),
  supplierController.deleteSupplier
);

module.exports = router;
