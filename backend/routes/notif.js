// routes/notif.js
const router = require("express").Router();
const NotifController = require("../controllers/notifController");
const { authentication } = require("../middlewares/auth");

router.get("/", authentication, NotifController.getNotif);

module.exports = router;
