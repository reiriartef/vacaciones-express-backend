const AuthController = require("../controllers/auth.controller");
const authController = new AuthController();
const express = require("express");
const router = express.Router();

router.post("/login", authController.login);

module.exports = router;
