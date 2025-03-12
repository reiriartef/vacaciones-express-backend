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

  async getUsers(req, res) {
    try {
      const users = await usuarioService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async getUserById(req, res) {
    try {
      const { id } = req.params;
      const user = await usuarioService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  async changePassword(req, res) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const token = authorizationHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({ message: "Token missing" });
      }
      const { newPassword } = req.body;
      const user = await usuarioService.changePassword(newPassword, token);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}

module.exports = UsuarioController;
