const FeriadosService = require("../services/feriados.service");
const feriadosService = new FeriadosService();

class FeriadosController {
  async getAll(req, res) {
    try {
      const feriados = await feriadosService.getAll();
      return res.json(feriados);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async createFeriado(req, res) {
    try {
      const { titulo, fecha } = req.body;
      const feriado = await feriadosService.createFeriado(titulo, fecha);
      return res.json(feriado);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = FeriadosController;
