const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Funcionario = require("../models/funcionario.model");
const Cargo = require("../models/cargo.model");
const Dependencia = require("../models/dependencia.model");

class AuthService {
  async login(nombre_usuario, contraseña) {
    nombre_usuario = nombre_usuario.toLowerCase();
    try {
      const usuario = await Usuario.findOne({
        where: { nombre_usuario },
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
              },
            ],
          },
        ],
      });
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }
      const contraseñaValida = await bcrypt.compare(
        contraseña,
        usuario.contraseña
      );
      console.log(usuario);
      if (!contraseñaValida) throw new Error("Contraseña inválida");
      const token = jwt.sign(
        {
          cedula: usuario.funcionario,
          id: usuario.id,
          nombre: usuario.funcionarioDetails.primer_nombre,
          apellido: usuario.funcionarioDetails.primer_apellido,
          isAdmin: usuario.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      return token;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
