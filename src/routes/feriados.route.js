const FeriadosController = require("../controllers/feriados.controller");
const feriadosController = new FeriadosController();
const express = require("express");
const router = express.Router();

router.get("/feriados", feriadosController.getAll);
router.post("/feriados", feriadosController.createFeriado);

module.exports = router;
