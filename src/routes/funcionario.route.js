const FuncionarioController = require("../controllers/funcionario.controller");
const funcionarioController = new FuncionarioController();
const express = require("express");
const router = new express.Router();

router.post("/funcionarios", funcionarioController.createFuncionario);
router.get("/funcionarios", funcionarioController.getFuncionarios);
router.get("/funcionarios/:ci", funcionarioController.getFuncionarioById);
router.put("/funcionarios/:id", funcionarioController.updateFuncionario);

module.exports = router;
