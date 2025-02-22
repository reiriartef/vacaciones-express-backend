const UsuarioService = require("../services/usuario.service");
const usuarioService = new UsuarioService();

class UsuarioController {
  async createUser(req, res) {
    try {
      const { funcionario } = req.body;
      const newUser = await usuarioService.createUser(funcionario);
      res.status(201).json(newUser);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UsuarioController;
