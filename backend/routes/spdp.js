const express = require("express");
const router = express.Router();

const SpdpController = require("../controllers/spdpController");
const { authentication } = require("../middlewares/auth");
const { validateSpdp } = require("../middlewares/validation");

// create
router.post("/", authentication, validateSpdp, SpdpController.create);

// get all
router.get("/", authentication, SpdpController.getAll);

//get by id
router.get("/:id", authentication, SpdpController.getById);

module.exports = router;
