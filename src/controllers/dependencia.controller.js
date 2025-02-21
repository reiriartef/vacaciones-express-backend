const DependenciaService = require("../services/dependencia.service");

const dependenciaService = new DependenciaService();

class DependenciaController {
  async createDependencia(req, res) {
    try {
      const { nombre } = req.body;
      const newDependencia = await dependenciaService.createDependencia(nombre);
      res.status(201).json(newDependencia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDependencias(req, res) {
    try {
      const dependencias = await dependenciaService.getDependencias();
      res.status(200).json(dependencias);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getDependenciaById(req, res) {
    try {
      const { id } = req.params;
      const dependencia = await dependenciaService.getDependenciaById(id);
      res.status(200).json(dependencia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateDependencia(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      const updatedDependencia = await dependenciaService.updateDependencia(
        id,
        nombre
      );
      res.status(200).json(updatedDependencia);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = DependenciaController;
