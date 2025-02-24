const VacacionesController = require("../controllers/vacaciones.controller");
const vacacionesController = new VacacionesController();
const express = require("express");
const router = new express.Router();

router.post("/vacaciones", vacacionesController.solicitarVacaciones);
router.get("/vacaciones", vacacionesController.listarVacaciones);

module.exports = router;
