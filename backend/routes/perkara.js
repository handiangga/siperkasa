const express = require("express");
const router = express.Router();

const PerkaraController = require("../controllers/perkaraController");
const {
  authentication,
  hasRole,
  authorizationPerkara,
} = require("../middlewares/auth");

// get all (admin + kajari)
router.get(
  "/",
  authentication,
  hasRole(["admin", "kajari"]),
  PerkaraController.getAll,
);

// my perkara (jaksa)
router.get(
  "/my",
  authentication,
  hasRole(["jaksa"]),
  PerkaraController.getMyPerkara,
);

// 🔥 DETAIL (FIX PARAM)
router.get(
  "/:id",
  authentication,
  authorizationPerkara,
  PerkaraController.getDetail,
);
router.patch("/status/:id", authentication, PerkaraController.updateStatus);

module.exports = router;
