const express = require("express");
const router = express.Router();

const SpdpController = require("../controllers/spdpController");
const { authentication, authorization } = require("../middlewares/auth");
const { validateSpdp } = require("../middlewares/validation");

// =========================
// 🔥 CREATE (ADMIN + OPERATOR)
// =========================
router.post(
  "/",
  authentication,
  authorization("admin", "operator"),
  validateSpdp,
  SpdpController.create,
);

// =========================
// 🔥 GET ALL (SEMUA ROLE)
// =========================
router.get(
  "/",
  authentication,
  authorization("admin", "kajari", "operator", "jaksa"), // 🔥 FIX
  SpdpController.getAll,
);

// =========================
// 🔥 GET BY ID (SEMUA ROLE)
// =========================
router.get(
  "/:id",
  authentication,
  authorization("admin", "kajari", "operator", "jaksa"), // 🔥 FIX
  SpdpController.getById,
);

// =========================
// ✏️ UPDATE (ADMIN ONLY)
// =========================
router.put(
  "/:id",
  authentication,
  authorization("admin"),
  validateSpdp,
  SpdpController.update,
);

// =========================
// ❌ DELETE (ADMIN ONLY)
// =========================
router.delete(
  "/:id",
  authentication,
  authorization("admin"),
  SpdpController.delete,
);

module.exports = router;
