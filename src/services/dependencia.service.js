const Dependencia = require("../models/dependencia.model");

class DependenciaService {
  async createDependencia(nombre) {
    try {
      const newDependencia = await Dependencia.create({
        nombre,
      });
      return newDependencia;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDependencias() {
    try {
      const dependencias = await Dependencia.findAll();
      return dependencias;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getDependenciaById(id) {
    try {
      const dependencia = await Dependencia.findByPk(id);
      return dependencia;
    } catch (error) {
      throw new Error(error);
    }
  }

  async updateDependencia(id, nombre) {
    try {
      const dependencia = await Dependencia.update(
        { nombre },
        {
          where: {
            id,
          },
        }
      );
      return dependencia;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = DependenciaService;
