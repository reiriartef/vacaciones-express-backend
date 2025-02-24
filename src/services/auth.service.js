const Usuario = require("../models/usuario.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

class AuthService {
  async login(nombre_usuario, contraseña) {
    nombre_usuario = nombre_usuario.toLowerCase();
    try {
      const usuario = await Usuario.findOne({ where: { nombre_usuario } });
      if (!usuario) {
        throw new Error("Usuario no encontrado");
      }
      const contraseñaValida = await bcrypt.compare(
        contraseña,
        usuario.contraseña
      );
      if (!contraseñaValida) throw new Error("Contraseña inválida");
      const token = jwt.sign(
        { cedula: usuario.funcionario, id: usuario.id },
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
