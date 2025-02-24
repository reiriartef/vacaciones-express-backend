require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const Database = require("./config/db");
const db = new Database();
const morgan = require("morgan");
const cargoRoute = require("./src/routes/cargo.route");
const dependenciaRoute = require("./src/routes/dependencia.route");
const funcionarioRoute = require("./src/routes/funcionario.route");
const usuarioRoute = require("./src/routes/usuario.route");
const authRoute = require("./src/routes/auth.route");
const vacacionesRoute = require("./src/routes/vacaciones.route");
const feriadosRoute = require("./src/routes/feriados.route");
const authMiddleware = require("./src/middlewares/auth.middleware");

db.connect();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", authMiddleware, cargoRoute);
app.use("/api", authMiddleware, dependenciaRoute);
app.use("/api", authMiddleware, funcionarioRoute);
app.use("/api", authMiddleware, usuarioRoute);
app.use("/api", authMiddleware, vacacionesRoute);
app.use("/api", authMiddleware, feriadosRoute);
app.use("/auth", authRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
