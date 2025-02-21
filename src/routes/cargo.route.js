const CargoController = require("../controllers/cargo.controller");
const cargoController = new CargoController();
const express = require("express");
const router = new express.Router();

router.post("/cargos", cargoController.createCargo);
router.get("/cargos", cargoController.getCargos);
router.get("/cargos/:id", cargoController.getCargoById);
router.put("/cargos/:id", cargoController.updateCargo);

module.exports = router;
