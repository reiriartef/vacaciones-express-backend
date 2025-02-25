const Permisos = require("../models/permisos.model");
const Funcionario = require("../models/funcionario.model");
const Dependencia = require("../models/dependencia.model");
const Cargo = require("../models/cargo.model");
const TipoEmpleado = require("../models/tipoEmpleado.model");

class PermisosService {
  async crearPermiso(fecha_permiso, motivo, observaciones, funcionario) {
    try {
      const permiso = await Permisos.create({
        fecha_permiso,
        motivo,
        observaciones,
        funcionario,
      });
      return permiso;
    } catch (error) {
      throw error;
    }
  }

  async obtenerPermisos() {
    try {
      const permisos = await Permisos.findAll({
        include: [
          {
            model: Funcionario,
            as: "funcionarioDetails",
            attributes: [
              "cedula",
              "primer_nombre",
              "segundo_nombre",
              "primer_apellido",
              "segundo_apellido",
              "fecha_ingreso",
            ],
            include: [
              {
                model: Dependencia,
                as: "dependencia",
                attributes: ["nombre"],
              },
              {
                model: Cargo,
                as: "cargo",
                attributes: ["nombre"],
                include: [
                  {
                    model: TipoEmpleado,
                    as: "tipoEmpleado",
                    attributes: ["descripcion"],
                  },
                ],
              },
            ],
          },
        ],
      });
      return permisos;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = PermisosService;
