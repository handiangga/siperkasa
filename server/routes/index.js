const express = require("express");
const router = express.Router();

const userRoutes = require("./user");
const perkaraRoutes = require("./perkara");
const jaksaRoutes = require("./jaksa");
const p16Routes = require("./p16");
const spdpRoutes = require("./spdp");

router.use("/users", userRoutes);
router.use("/spdps", spdpRoutes);
router.use("/perkaras", perkaraRoutes);
router.use("/jaksas", jaksaRoutes);
router.use("/p16", p16Routes);

module.exports = router;
