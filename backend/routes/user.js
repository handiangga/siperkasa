const express = require("express");
const router = express.Router();

const UserController = require("../controllers/userController");
const { authentication, hasRole } = require("../middlewares/auth");
const { validateLogin } = require("../middlewares/validation");

// 🔹 LOGIN
router.post("/login", validateLogin, UserController.login);

// 🔹 REGISTER
router.post("/register", UserController.register);

// 🔥 GET ALL USER (INI YANG KURANG)
router.get("/", authentication, UserController.getAll);

// 🔥 DELETE
router.delete("/:id", authentication, UserController.delete);

module.exports = router;
