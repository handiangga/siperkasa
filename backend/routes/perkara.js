const express = require("express");
const router = express.Router();

const PerkaraController = require("../controllers/perkaraController");
const {
  authentication,
  authorization,
  authorizationPerkara,
} = require("../middlewares/auth");

// =========================
// 🔥 GET ALL (SEMUA ROLE)
// =========================
router.get(
  "/",
  authentication,
  authorization("admin", "kajari", "operator", "jaksa"), // 🔥 FIX
  PerkaraController.getAll,
);

// =========================
// 🔥 MY PERKARA (JAKSA)
// =========================
router.get(
  "/my",
  authentication,
  authorization("jaksa"),
  PerkaraController.getMyPerkara,
);

// =========================
// 🔥 DETAIL (ROLE BASED)
// =========================
router.get(
  "/:perkara_id",
  authentication,
  authorizationPerkara, // 🔥 ini sudah benar
  PerkaraController.getDetail,
);

// =========================
// 🔥 UPDATE STATUS (ADMIN ONLY)
// =========================
router.patch(
  "/status/:perkara_id",
  authentication,
  authorization("admin"),
  PerkaraController.updateStatus,
);

module.exports = router;
