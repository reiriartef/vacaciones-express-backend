const PermisosService = require("../services/permisos.service");
const permisosService = new PermisosService();

class PermisosController {
  async obtenerPermisos(req, res) {
    try {
      const permisos = await permisosService.obtenerPermisos();
      res.status(200).json(permisos);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async crearPermiso(req, res) {
    try {
      const { fecha_permiso, motivo, observaciones, funcionario } = req.body;
      const permiso = await permisosService.crearPermiso(
        fecha_permiso,
        motivo,
        observaciones,
        funcionario
      );
      res.status(201).json(permiso);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = PermisosController;
