const express = require("express");
const router = express.Router();

const P16Controller = require("../controllers/p16Controller");
const { authentication, hasRole } = require("../middlewares/auth");
const { validateP16 } = require("../middlewares/validation");

// create
router.post(
  "/",
  authentication,
  hasRole(["admin"]),
  validateP16,
  P16Controller.create,
);

// get all
router.get("/", authentication, P16Controller.getAll);
router.get("/jaksa/:id", authentication, P16Controller.getByJaksa);

module.exports = router;
