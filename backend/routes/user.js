const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const { authentication, authorization } = require("../middlewares/auth");

const { validateLogin } = require("../middlewares/validation");

// =========================
// 🔐 LOGIN
// =========================
router.post("/login", validateLogin, UserController.login);

// =========================
// 🔥 REGISTER (ADMIN ONLY)
// =========================
router.post(
  "/register",
  authentication,
  authorization("admin"),
  UserController.register,
);

// =========================
// 🔥 GET ALL USER (ADMIN ONLY)
// =========================
router.get("/", authentication, authorization("admin"), UserController.getAll);

// =========================
// ❌ DELETE USER (ADMIN ONLY)
// =========================
router.delete(
  "/:id",
  authentication,
  authorization("admin"),
  UserController.delete,
);

// =========================
// 🔥 GET BY ID (ADMIN ONLY)
// =========================
router.get(
  "/:id",
  authentication,
  authorization("admin"),
  UserController.getById,
);

// =========================
// 🔥 UPDATE USER (ADMIN ONLY)
// =========================
router.put(
  "/:id",
  authentication,
  authorization("admin"),
  UserController.update,
);

// =========================
// 🔥 GET PROFILE (SEMUA USER)
// =========================
router.get("/profile", authentication, UserController.getProfile);

// =========================
// 🔥 UPDATE PASSWORD (SEMUA USER)
// =========================
router.patch("/change-password", authentication, UserController.changePassword);

module.exports = router;
