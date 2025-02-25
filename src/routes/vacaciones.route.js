const VacacionesController = require("../controllers/vacaciones.controller");
const vacacionesController = new VacacionesController();
const express = require("express");
const router = new express.Router();

router.post("/vacaciones", vacacionesController.solicitarVacaciones);
router.get("/vacaciones", vacacionesController.listarVacaciones);
router.put("/vacaciones/:id", vacacionesController.cambiarEstadoVacaciones);

module.exports = router;
