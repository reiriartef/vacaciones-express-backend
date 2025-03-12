const UsuarioController = require("../controllers/usuario.controller");
const usuarioController = new UsuarioController();
const express = require("express");
const router = new express.Router();

router.post("/usuarios", usuarioController.createUser);
router.get("/usuarios", usuarioController.getUsers);
router.get("/usuarios/:id", usuarioController.getUserById);
router.put("/usuarios", usuarioController.changePassword);

module.exports = router;
