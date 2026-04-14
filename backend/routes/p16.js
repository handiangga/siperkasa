const express = require("express");
const router = express.Router();

const P16Controller = require("../controllers/p16Controller");
const {
  authentication,
  authorization,
  authorizationPerkara,
} = require("../middlewares/auth");

// =========================
// 🔥 CREATE (ADMIN + OPERATOR)
// =========================
router.post(
  "/",
  authentication,
  authorization("admin", "operator"),
  P16Controller.create,
);

// =========================
// 🔥 GET ALL (SEMUA ROLE)
// =========================
router.get(
  "/",
  authentication,
  authorization("admin", "kajari", "operator", "jaksa"), // 🔥 FIX
  P16Controller.getAll,
);

// =========================
// 🔥 GET BY JAKSA (JAKSA ONLY)
// =========================
router.get(
  "/jaksa/:id",
  authentication,
  authorization("admin", "kajari", "operator", "jaksa"),
  P16Controller.getByJaksa,
);

// =========================
// 🔥 GET BY PERKARA (ROLE BASED)
// =========================
router.get(
  "/perkara/:id",
  authentication,
  authorizationPerkara, // 🔥 FIX (biar jaksa cuma lihat punya dia)
  P16Controller.getByPerkara,
);

// =========================
// 🔥 DETAIL (ROLE BASED)
// =========================
router.get(
  "/:id",
  authentication,
  authorization("admin", "kajari", "operator", "jaksa"), // 🔥 FIX
  P16Controller.getById,
);

// =========================
// 🔥 UPDATE (ADMIN ONLY)
// =========================
router.put(
  "/:id",
  authentication,
  authorization("admin"),
  P16Controller.update,
);

// =========================
// 🔥 DELETE (ADMIN ONLY)
// =========================
router.delete(
  "/:id",
  authentication,
  authorization("admin"),
  P16Controller.delete,
);

module.exports = router;
