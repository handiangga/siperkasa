const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const { validateLogin } = require("../middlewares/validation");

// login
router.post("/login", validateLogin, UserController.login);

// register (optional)
router.post("/register", UserController.register);

module.exports = router;
