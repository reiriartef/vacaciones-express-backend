const Vacaciones = require("../models/vacaciones.model");
const Funcionario = require("../models/funcionario.model");
const Cargo = require("../models/cargo.model");
const Dependencia = require("../models/dependencia.model");
const TipoEmpleado = require("../models/tipoEmpleado.model");
const {
  calcularFechaFinalizacionVacaciones,
  calcularDias,
} = require("../helpers/diasADisfrutar");
const Feriados = require("../models/feriados.model");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.model");

class VacacionesService {
  async solicitarVacaciones(cedula, fecha_salida, año) {
    const feriados = await Feriados.findAll();
    const feriadosArray = feriados.map((feriado) => feriado.fecha);
    try {
      if (!cedula || !fecha_salida || !año) {
        throw new Error("Cédula, fecha de salida y año son requeridos");
      }

      const funcionario = await Funcionario.findByPk(cedula, {
        include: [
          {
            model: Dependencia,
            as: "dependencia",
            attributes: { exclude: ["id"] },
          },
          {
            model: Cargo,
            as: "cargo",
            attributes: { exclude: ["id", "tipo_empleado"] },
            include: [
              {
                model: TipoEmpleado,
                as: "tipoEmpleado",
                attributes: { exclude: ["id"] },
              },
            ],
          },
        ],
        attributes: { exclude: ["id_dependencia", "id_cargo", "id"] },
      });
      if (!funcionario) {
        throw new Error("Funcionario inválido");
      }

      if (año < new Date(funcionario.fecha_ingreso).getFullYear()) {
        throw new Error(
          "El año de vacaciones no puede ser menor al año de ingreso del funcionario"
        );
      }

      const vacaciones = await Vacaciones.findOne({
        where: { año, funcionario: cedula },
      });
      if (vacaciones) {
        throw new Error(
          vacaciones.estatus == "SOLICITADA"
            ? "Ya se ha generado un registro de vacaciones para este año la misma se encuentra en proceso de aprobación"
            : vacaciones.estatus == "DISFRUTADA"
            ? "Ya se ha generado un registro de vacaciones para este año la misma ha sido disfrutada por el funcionario"
            : "Ya se ha generado un registro de vacaciones para este año la misma ha sido aprobada y está siendo disfrutada por el funcionario"
        );
      }
      let diasVacaciones;
      if (funcionario.fecha_ingreso != funcionario.fecha_prima) {
        diasVacaciones = await calcularDias(
          funcionario.cargo.tipoEmpleado.descripcion,
          funcionario.fecha_prima,
          año
        );
      } else {
        diasVacaciones = await calcularDias(
          funcionario.cargo.tipoEmpleado.descripcion,
          funcionario.fecha_ingreso,
          año
        );
      }
      const { fechaFinalizacion, fechaReinicio } =
        await calcularFechaFinalizacionVacaciones(
          diasVacaciones,
          fecha_salida,
          feriadosArray
        );

      return await Vacaciones.create({
        funcionario: cedula,
        fecha_salida,
        fecha_reincorporacion: fechaReinicio,
        año,
        dias_disfrutar: diasVacaciones,
        fecha_finalizacion: fechaFinalizacion,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async listarVacaciones() {
    try {
      const vacaciones = await Vacaciones.findAll({
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
          {
            model: Usuario,
            as: "usuarioAprobador",
            attributes: ["nombre_usuario"],
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
              },
            ],
          },
        ],
        attributes: { exclude: ["funcionario", "aprobado_por"] },
        order: [["id", "DESC"]],
      });
      return vacaciones;
    } catch (error) {
      throw new Error(error);
    }
  }

  async cambiarEstadoVacaciones(id, token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        throw new Error("Token inválido");
      }
      const userId = decoded.id;
      const vacaciones = await Vacaciones.findByPk(id);
      if (!vacaciones) {
        throw new Error("Vacaciones no encontradas");
      }
      if (vacaciones.estatus === "SOLICITADA") {
        vacaciones.estatus = "APROBADA";
        vacaciones.aprobado_por = userId;
      } else {
        vacaciones.estatus = "DISFRUTADA";
      }

      return await vacaciones.save();
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = VacacionesService;
