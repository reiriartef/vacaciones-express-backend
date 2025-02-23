const { DataTypes, Model } = require("sequelize");
const Database = require("../../config/db");
const Funcionario = require("./funcionario.model");
const db = new Database();

class Usuario extends Model {}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    funcionario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre_usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    contraseña: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    estado: {
      type: DataTypes.STRING,
      defaultValue: "ACTIVO",
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "usuario",
    tableName: "usuario",
    timestamps: false,
  }
);

module.exports = Usuario;
