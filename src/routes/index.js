const express = require("express");
const router = express.Router();

// AUTH ROUTES
const authRoutes = require("./auth/auth");
const usersRoutes = require("./auth/users");

// PRODUCTION ROUTES
const finalStatusRoutes = require("./production/final_status");
const kanagataRoutes = require("./production/kanagata");
const machineRoutes = require("./production/machine");
const maintenanceRoutes = require("./production/maintenance");
const pcaRoutes = require("./production/pca");
const planRoutes = require("./production/plan");
const problemRoutes = require("./production/problem");
const productRoutes = require("./production/product");
const productionRoutes = require("./production/production");
const statusRoutes = require("./production/status");

// REGISTER ROUTES
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/status", statusRoutes);
router.use("/machine", machineRoutes);
router.use("/problem", problemRoutes);
router.use("/product", productRoutes);
router.use("/kanagata", kanagataRoutes);
router.use("/plan", planRoutes);
router.use("/pca", pcaRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/final_status", finalStatusRoutes);
router.use("/production", productionRoutes);

module.exports = router;
