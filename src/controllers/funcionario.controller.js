const FuncionarioService = require("../services/funcionario.service");
const funcionarioService = new FuncionarioService();

class FuncionarioController {
  async createFuncionario(req, res) {
    try {
      const {
        cedula,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_dependencia,
        id_cargo,
        fecha_ingreso,
        fecha_prima,
      } = req.body;
      const newFuncionario = await funcionarioService.createFuncionario(
        cedula,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_dependencia,
        id_cargo,
        fecha_ingreso,
        fecha_prima
      );
      res.status(201).json(newFuncionario);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getFuncionarios(req, res) {
    try {
      const funcionarios = await funcionarioService.getFuncionarios();
      res.status(200).json(funcionarios);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getFuncionarioById(req, res) {
    try {
      const { ci } = req.params;
      const funcionario = await funcionarioService.getFuncionarioById(ci);
      res.status(200).json(funcionario);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async updateFuncionario(req, res) {
    try {
      const { id } = req.params;
      const {
        cedula,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_dependencia,
        id_cargo,
        fecha_ingreso,
      } = req.body;
      const updatedFuncionario = await funcionarioService.updateFuncionario(
        id,
        cedula,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_dependencia,
        id_cargo,
        fecha_ingreso
      );
      res.status(200).json(updatedFuncionario);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = FuncionarioController;
