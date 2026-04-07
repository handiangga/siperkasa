// routes/dashboard.js
const router = require("express").Router();
const DashboardController = require("../controllers/dashboardController");
const { authentication } = require("../middlewares/auth");

router.get("/", authentication, DashboardController.getStats);

module.exports = router;
