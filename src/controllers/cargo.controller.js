const CargoService = require("../services/cargo.service");

const cargoService = new CargoService();

class CargoController {
  async createCargo(req, res) {
    try {
      console.log(req.body);
      const { nombre, tipo_empleado } = req.body;
      const newCargo = await cargoService.createCargo(nombre, tipo_empleado);
      res.status(201).json(newCargo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCargos(req, res) {
    try {
      const cargos = await cargoService.getCargos();
      res.status(200).json(cargos);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async getCargoById(req, res) {
    try {
      const { id } = req.params;
      const cargo = await cargoService.getCargoById(id);
      res.status(200).json(cargo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCargo(req, res) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      const updatedCargo = await cargoService.updateCargo(id, nombre);
      res.status(200).json(updatedCargo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = CargoController;
