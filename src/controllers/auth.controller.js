const AuthService = require("../services/auth.service");
const authService = new AuthService();
class AuthController {
  async login(req, res) {
    try {
      const { nombre_usuario, contraseña } = req.body;
      const token = await authService.login(nombre_usuario, contraseña);
      res.json({ token });
    } catch (error) {
      res.status(401).json({ message: error.message });
    }
  }
}

module.exports = AuthController;
