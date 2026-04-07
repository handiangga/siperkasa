const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const perkaraRoutes = require("./perkara");
const jaksaRoutes = require("./jaksa");
const p16Routes = require("./p16");
const spdpRoutes = require("./spdp");
const dashboardRoutes = require("./dashboard");
const notifRoutes = require("./notif");

router.use("/users", userRoutes);
router.use("/spdps", spdpRoutes);
router.use("/perkaras", perkaraRoutes);
router.use("/jaksas", jaksaRoutes);
router.use("/p16", p16Routes);
router.use("/dashboard", dashboardRoutes);
router.use("/notif", notifRoutes);

module.exports = router;
