const Funcionario = require("../models/funcionario.model");
const Dependencia = require("../models/dependencia.model");
const Cargo = require("../models/cargo.model");
const TipoEmpleado = require("../models/tipoEmpleado.model");
class FuncionarioService {
  async createFuncionario(
    cedula,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    id_dependencia,
    id_cargo,
    fecha_ingreso
  ) {
    try {
      const newFuncionario = await Funcionario.create({
        cedula,
        primer_nombre,
        segundo_nombre,
        primer_apellido,
        segundo_apellido,
        id_dependencia,
        id_cargo,
        fecha_ingreso,
      });
      return newFuncionario;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFuncionarios() {
    try {
      const funcionarios = await Funcionario.findAll({
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
        attributes: { exclude: ["id_dependencia", "id_cargo"] },
      });
      return funcionarios;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getFuncionarioById(ci) {
    try {
      const funcionario = await Funcionario.findByPk(ci, {
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
        attributes: { exclude: ["id_dependencia", "id_cargo"] },
      });
      return funcionario;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateFuncionario(
    id,
    cedula,
    primer_nombre,
    segundo_nombre,
    primer_apellido,
    segundo_apellido,
    id_dependencia,
    id_cargo,
    fecha_ingreso
  ) {
    try {
      const funcionario = await Funcionario.update(
        {
          cedula,
          primer_nombre,
          segundo_nombre,
          primer_apellido,
          segundo_apellido,
          id_dependencia,
          id_cargo,
          fecha_ingreso,
        },
        {
          where: {
            id,
          },
        }
      );
      return funcionario;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = FuncionarioService;
