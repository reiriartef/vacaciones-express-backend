const Feriados = require("../models/feriados.model");

class FeriadosService {
  async getAll() {
    try {
      return await Feriados.findAll();
    } catch (error) {
      throw error;
    }
  }

  async createFeriado(titulo, fecha) {
    try {
      return await Feriados.create({ titulo, fecha });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = FeriadosService;
