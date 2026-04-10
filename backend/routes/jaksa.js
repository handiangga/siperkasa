const express = require("express");
const router = express.Router();

const JaksaController = require("../controllers/jaksaController");
const { authentication, authorization } = require("../middlewares/auth");

const { validateJaksa } = require("../middlewares/validation");

// 🔥 GET ALL (admin, kajari, operator)
router.get(
  "/",
  authentication,
  authorization("admin", "kajari", "operator"),
  JaksaController.getAll,
);

// 🔥 GET BY ID (admin, kajari, operator)
router.get(
  "/:id",
  authentication,
  authorization("admin", "kajari", "operator"),
  JaksaController.getById,
);

// 🔥 CREATE (admin only)
router.post(
  "/",
  authentication,
  authorization("admin"),
  validateJaksa,
  JaksaController.create,
);

// 🔥 UPDATE (admin only)
router.put(
  "/:id",
  authentication,
  authorization("admin"),
  validateJaksa,
  JaksaController.update,
);

// 🔥 DELETE (admin only)
router.delete(
  "/:id",
  authentication,
  authorization("admin"),
  JaksaController.delete,
);

module.exports = router;
