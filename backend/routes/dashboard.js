const router = require("express").Router();
const DashboardController = require("../controllers/dashboardController");
const { authentication } = require("../middlewares/auth");

// 🔥 admin, kajari, operator
router.get("/full", authentication, DashboardController.fullStats);

// 🔥 jaksa only
router.get("/jaksa", authentication, DashboardController.jaksaStats);

module.exports = router;
