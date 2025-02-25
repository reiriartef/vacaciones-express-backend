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

  async cambiarEstadoVacaciones(req, res) {
    try {
      const { id } = req.params;
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const token = authorizationHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }

      const vacaciones = await vacacionesService.cambiarEstadoVacaciones(
        id,
        token
      );
      return res.status(200).json(vacaciones);
    } catch (error) {
      return res.status(401).json({ message: error.message });
    }
  }
}

module.exports = VacacionesController;
