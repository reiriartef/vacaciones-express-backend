const UsuarioController = require("../controllers/usuario.controller");
const usuarioController = new UsuarioController();
const express = require("express");
const router = new express.Router();

router.post("/usuarios", usuarioController.createUser);
router.get("/usuarios", usuarioController.getUsers);

module.exports = router;
