const { DataTypes, Model } = require("sequelize");
const Database = require("../../config/db");
const db = new Database();
const Dependencia = require("./dependencia.model");
const Cargo = require("./cargo.model");
const Usuario = require("./usuario.model");

class Funcionario extends Model {}

Funcionario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    cedula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      unique: true,
      allowNull: false,
    },
    primer_nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    segundo_nombre: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    primer_apellido: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    segundo_apellido: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_dependencia: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_cargo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "Funcionario",
    tableName: "funcionario",
    timestamps: false,
  }
);

Funcionario.belongsTo(Dependencia, {
  foreignKey: "id_dependencia",
  targetKey: "id",
});

Funcionario.belongsTo(Cargo, {
  foreignKey: "id_cargo",
  targetKey: "id",
});

module.exports = Funcionario;
