const Usuario = require("../models/usuario.model");
const Funcionario = require("../models/funcionario.model");
const bcrypt = require("bcrypt");

class UsuarioService {
  async createUser(cedula) {
    const funcionario = await Funcionario.findByPk(cedula);
    if (!funcionario) {
      throw new Error("El funcionario no existe");
    }

    const userName =
      funcionario.primer_apellido.slice(0, 4).toLowerCase() +
      funcionario.primer_nombre.slice(0, 3).toLowerCase() +
      funcionario.segundo_nombre.slice(0, 1).toLowerCase();

    const usuario = await Usuario.findOne({
      where: { nombre_usuario: userName },
    });
    if (usuario) {
      throw new Error("El usuario ya existe");
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(cedula.toString(), salt);
    return await Usuario.create({
      funcionario: cedula,
      nombre_usuario: userName,
      contraseña: password,
    });
  }
}

module.exports = UsuarioService;
