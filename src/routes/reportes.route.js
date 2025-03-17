const express = require("express");
const router = express.Router();
const ReportesController = require("../controllers/reportes.controller");
const reportesController = new ReportesController();

router.get(
  "/reportes/aprobacion-vacaciones/:id",
  reportesController.generarReporteAprobacionVacaciones
);

module.exports = router;
