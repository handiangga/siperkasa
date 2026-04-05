const express = require("express");
const router = express.Router();

const JaksaController = require("../controllers/jaksaController");
const { authentication, hasRole } = require("../middlewares/auth");
const { validateJaksa } = require("../middlewares/validation");

// get all
router.get("/", authentication, JaksaController.getAll);

// create
router.post(
  "/",
  authentication,
  hasRole(["admin"]),
  validateJaksa,
  JaksaController.create
);

module.exports = router;