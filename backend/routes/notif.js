// routes/notif.js
const router = require("express").Router();
const NotifController = require("../controllers/notifController");
const { authentication, authorization } = require("../middlewares/auth");

// 🔥 notif untuk semua role login
router.get(
  "/",
  authentication,
  authorization("admin", "kajari", "operator", "jaksa"),
  NotifController.getNotif,
);

module.exports = router;
