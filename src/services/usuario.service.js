const Usuario = require("../models/usuario.model");
const Funcionario = require("../models/funcionario.model");
const Dependencia = require("../models/dependencia.model");
const Cargo = require("../models/cargo.model");
const TipoEmpleado = require("../models/tipoEmpleado.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class UsuarioService {
  async createUser(cedula) {
    if (!cedula) {
      throw new Error("La cédula es requerida");
    }
    const funcionario = await Funcionario.findByPk(cedula);
    if (!funcionario) {
      throw new Error("El funcionario no existe");
    }

    let userName =
      funcionario.primer_apellido.slice(0, 4).toLowerCase() +
      funcionario.primer_nombre.slice(0, 3).toLowerCase() +
      (funcionario.segundo_nombre
        ? funcionario.segundo_nombre.slice(0, 1).toLowerCase()
        : "x");

    let usuario = await Usuario.findOne({
      where: { nombre_usuario: userName },
    });

    if (usuario && usuario.funcionario == cedula) {
      throw new Error("El funcionario ya posee usuario.");
    }

    // Si el nombre de usuario ya existe, agregar un sufijo incremental
    if (usuario) {
      let suffix = 1;
      let newUserName;
      do {
        newUserName = `${userName}0${suffix}`;
        usuario = await Usuario.findOne({
          where: { nombre_usuario: newUserName },
        });
        suffix++;
      } while (usuario);
      userName = newUserName;
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(cedula.toString(), salt);
    return await Usuario.create({
      funcionario: cedula,
      nombre_usuario: userName,
      contraseña: password,
    });
  }

  async getUsers() {
    return await Usuario.findAll({
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
      attributes: { exclude: ["contraseña", "id"] },
    });
  }

  async getUserById(id) {
    return await Usuario.findByPk(id, {
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
      attributes: { exclude: ["contraseña", "id"] },
    });
  }

  async changePassword(newPassword, token) {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      throw new Error("Token inválido");
    }

    const userId = decoded.id;
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);
    return await Usuario.update(
      { contraseña: password },
      { where: { id: userId } }
    );
  }
}

module.exports = UsuarioService;
