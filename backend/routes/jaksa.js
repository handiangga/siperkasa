const express = require("express");
const router = express.Router();

const JaksaController = require("../controllers/jaksaController");
const { authentication, hasRole } = require("../middlewares/auth");
const { validateJaksa } = require("../middlewares/validation");

// 🔥 GET ALL
router.get("/", authentication, JaksaController.getAll);

// 🔥 GET BY ID (INI YANG KURANG)
router.get("/:id", authentication, JaksaController.getById);

// 🔥 CREATE
router.post(
  "/",
  authentication,
  hasRole(["admin"]),
  validateJaksa,
  JaksaController.create,
);

// 🔥 UPDATE
router.put(
  "/:id",
  authentication,
  hasRole(["admin"]),
  validateJaksa,
  JaksaController.update,
);

// 🔥 DELETE
router.delete(
  "/:id",
  authentication,
  hasRole(["admin"]),
  JaksaController.delete,
);

module.exports = router;
