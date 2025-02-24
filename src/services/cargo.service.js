const Cargo = require("../models/cargo.model");
const TipoEmpleado = require("../models/tipoEmpleado.model");
class CargoService {
  async createCargo(nombre, tipo_empleado) {
    try {
      const newCargo = await Cargo.create({
        nombre,
        tipo_empleado,
      });
      return newCargo;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCargos() {
    try {
      const cargos = await Cargo.findAll({
        include: [
          {
            model: TipoEmpleado,
            as: "tipoEmpleado",
            attributes: { exclude: ["id"] },
          },
        ],
      });
      return cargos;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getCargoById(id) {
    try {
      const cargo = await Cargo.findByPk(id);
      return cargo;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateCargo(id, nombre) {
    try {
      const cargo = await Cargo.update(
        { nombre },
        {
          where: {
            id,
          },
        }
      );
      return cargo;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = CargoService;
