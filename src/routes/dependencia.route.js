const DependenciaController = require("../controllers/dependencia.controller");
const dependenciaController = new DependenciaController();
const express = require("express");
const router = new express.Router();

router.get("/dependencias", dependenciaController.getDependencias);
router.get("/dependencias/:id", dependenciaController.getDependenciaById);
router.post("/dependencias", dependenciaController.createDependencia);
router.put("/dependencias/:id", dependenciaController.updateDependencia);

module.exports = router;
