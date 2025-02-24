const VacacionesService = require("../services/vacaciones.service");
const vacacionesService = new VacacionesService();

class VacacionesController {
  async solicitarVacaciones(req, res) {
    try {
      const { cedula, fecha_salida, año } = req.body;
      const vacaciones = await vacacionesService.solicitarVacaciones(
        cedula,
        fecha_salida,
        año
      );
      return res.status(200).json(vacaciones);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }

  async listarVacaciones(req, res) {
    try {
      const vacaciones = await vacacionesService.listarVacaciones();
      return res.status(200).json(vacaciones);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
}

module.exports = VacacionesController;
