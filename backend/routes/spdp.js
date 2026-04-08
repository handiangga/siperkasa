const express = require("express");
const router = express.Router();

const SpdpController = require("../controllers/spdpController");
const { authentication } = require("../middlewares/auth");
const { validateSpdp } = require("../middlewares/validation");

// create
router.post("/", authentication, validateSpdp, SpdpController.create);

// get all
router.get("/", authentication, SpdpController.getAll);

// get by id
router.get("/:id", authentication, SpdpController.getById);

// ✏️ update
router.put("/:id", authentication, validateSpdp, SpdpController.update);

// delete
router.delete("/:id", authentication, SpdpController.delete);

module.exports = router;
