const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const perkaraRoutes = require("./perkara");
const jaksaRoutes = require("./jaksa");
const p16Routes = require("./p16");
const spdpRoutes = require("./spdp");
const dashboardRoutes = require("./dashboard");
const notifRoutes = require("./notif");

// 🔥 ROUTES
router.use("/users", userRoutes);
router.use("/spdp", spdpRoutes); // konsisten singular
router.use("/perkara", perkaraRoutes); // konsisten singular
router.use("/jaksa", jaksaRoutes); // konsisten singular
router.use("/p16", p16Routes);
router.use("/dashboard", dashboardRoutes);
router.use("/notif", notifRoutes);

module.exports = router;
