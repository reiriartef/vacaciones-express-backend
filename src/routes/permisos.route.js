const PermisosController = require("../controllers/permisos.controller");
const permisosController = new PermisosController();
const express = require("express");
const router = express.Router();

router.get("/permisos", permisosController.obtenerPermisos);
router.post("/permisos", permisosController.crearPermiso);

module.exports = router;
