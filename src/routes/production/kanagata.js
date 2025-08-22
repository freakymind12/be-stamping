const express = require("express");
const kanagataController = require("../../controllers/production/kanagata");
const authMiddleware = require("../../middleware/auth");
const { check, query } = require("express-validator");
const { cacheMiddleware, invalidateCacheMiddleware } = require("../../middleware/cacheMiddleware");
const router = express.Router();

router.get("/",
  authMiddleware.authenticateToken,
  kanagataController.getKanagata
);

router.get("/reset-code",
  authMiddleware.authenticateToken,
  kanagataController.getKanagataResetCode
)

router.get("/part",
  authMiddleware.authenticateToken,
  kanagataController.getKanagataPart
)

router.get("/part-category",
  authMiddleware.authenticateToken,
  kanagataController.getPartCategory
)

router.get("/part-request",
  authMiddleware.authenticateToken,
  kanagataController.getPartRequest
)

router.get("/inventory/usage-history",
  authMiddleware.authenticateToken,
  [
    query("id_kanagata_part", "id kanagata part is required").not().isEmpty(),
  ],
  kanagataController.getPartUsageHistory,
)

router.get("/inventory/below-safety",
  authMiddleware.authenticateToken,
  kanagataController.getPartBelowSafety
)

router.get("/inventory",
  authMiddleware.authenticateToken,
  kanagataController.getPartInventory
)

router.post("/",
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

router.post("/reset-code",
  authMiddleware.authenticateToken,
  [
    check("code")
      .not().isEmpty().withMessage("Reset code is required")
      .isNumeric()
      .withMessage("Reset code must be numeric")
      .isLength({ min: 2, max: 2 })
      .withMessage("Reset code must be exactly 2 digits"),
    check("name").not().isEmpty().withMessage("Name kanagata part is required")
  ],
  kanagataController.createKanagataResetCode
)

router.post("/part",
  authMiddleware.authenticateToken,
  [
    check("id_kanagata_part").not().isEmpty().withMessage("ID for kanagata part is required"),
    check("id_kanagata").not().isEmpty().withMessage("ID kanagata is required"),
    check("name").not().isEmpty().withMessage("Name for kanagata part is required"),
  ],
  kanagataController.createKanagataPart
)

router.post("/part-category",
  authMiddleware.authenticateToken,
  [
    check("name").not().isEmpty().withMessage("Category name is required")
  ],
  kanagataController.createPartCategory
)

router.post("/part-request",
  authMiddleware.authenticateToken,
  [
    check("id_kanagata_part").not().isEmpty().withMessage("Kanagata part is required"),
  ],
  kanagataController.createPartRequest
)

router.post("/part-request/ncc",
  authMiddleware.authenticateToken,
  [
    check("id_request").not().isEmpty().withMessage("ID Request is required"),
    check("note").not().isEmpty().withMessage("Note cannot be empty")
  ],
  kanagataController.createNccPart
)

router.patch("/:id",
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

router.patch("/reset-code/:id",
  authMiddleware.authenticateToken,
  [
    check("code")
      .not().isEmpty().withMessage("Reset code is required")
      .isNumeric()
      .withMessage("Reset code must be numeric")
      .isLength({ min: 2, max: 2 })
      .withMessage("Reset code must be exactly 2 digits"),
    check("name").not().isEmpty().withMessage("Name kanagata part is required"),
  ],
  kanagataController.updateKanagataResetCode
)

router.patch("/part/:id",
  authMiddleware.authenticateToken,
  [
    check("id_kanagata_part").not().isEmpty().withMessage("ID for kanagata part is required"),
    check("id_kanagata").not().isEmpty().withMessage("ID kanagata is required"),
    check("name").not().isEmpty().withMessage("Name for kanagata part is required"),
  ],
  kanagataController.updateKanagataPart
)

router.patch("/part-category/:id",
  authMiddleware.authenticateToken,
  [
    check("name").not().isEmpty().withMessage("Category name is required")
  ],
  kanagataController.updatePartCategory
)

router.patch("/part-request/:id",
  authMiddleware.authenticateToken,
  kanagataController.updatePartRequest
)

router.delete("/:id",
  authMiddleware.authenticateToken,
  kanagataController.deleteKanagata
);

router.delete("/reset-code/:id",
  authMiddleware.authenticateToken,
  kanagataController.deleteKanagataResetCode
)

router.delete("/part/:id",
  authMiddleware.authenticateToken,
  kanagataController.deleteKanagataPart
)

router.delete("/part-category/:id",
  authMiddleware.authenticateToken,
  kanagataController.deletePartCategory
)

router.delete("/part-request/:id",
  authMiddleware.authenticateToken,
  kanagataController.deletePartRequest
)

router.delete("/part-request/ncc/:id",
  authMiddleware.authenticateToken,
  kanagataController.deleteNccPart
)
module.exports = router;
