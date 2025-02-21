require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3001;
const cors = require("cors");
const Database = require("./config/db");
const db = new Database();
const cargoRoute = require("./src/routes/cargo.route");
const dependenciaRoute = require("./src/routes/dependencia.route");
const funcionarioRoute = require("./src/routes/funcionario.route");
db.connect();

app.use(express.json());
app.use(cors());

app.use("/api", cargoRoute);
app.use("/api", dependenciaRoute);
app.use("/api", funcionarioRoute);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
