const Vacaciones = require("../models/vacaciones.model");
const Funcionario = require("../models/funcionario.model");
const Cargo = require("../models/cargo.model");
const Dependencia = require("../models/dependencia.model");
const TipoEmpleado = require("../models/tipoEmpleado.model");
const {
  esDiaHabil,
  esFeriado,
  calcularDias,
  calcularFechaFinalizacion,
  calcularFechaReintegro,
} = require("../helpers/diasADisfrutar");
const Feriados = require("../models/feriados.model");
class VacacionesService {
  async solicitarVacaciones(cedula, fecha_salida, año) {
    const feriados = await Feriados.findAll();
    const feriadosArray = feriados.map((feriado) => new Date(feriado.fecha));
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

      if (año < funcionario.fecha_ingreso.getFullYear()) {
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
      const diasVacaciones = await calcularDias(
        funcionario.cargo.tipoEmpleado.descripcion,
        funcionario.fecha_ingreso,
        año
      );
      const fechaFinalizacion = await calcularFechaFinalizacion(
        fecha_salida,
        diasVacaciones,
        feriadosArray
      );

      const fechaReintegro = await calcularFechaReintegro(
        fechaFinalizacion,
        feriadosArray
      );
      return await Vacaciones.create({
        funcionario: cedula,
        fecha_salida,
        fecha_reincorporacion: fechaReintegro,
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
      const vacaciones = await Vacaciones.findAll();
      return vacaciones;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = VacacionesService;
