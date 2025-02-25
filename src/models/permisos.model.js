const { DataTypes, Model } = require("sequelize");
const Database = require("../../config/db");
const Funcionario = require("./funcionario.model");
const db = new Database();

class Permisos extends Model {}

Permisos.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    funcionario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_permiso: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "Permisos",
    tableName: "permisos",
    timestamps: false,
  }
);

Permisos.belongsTo(Funcionario, {
  foreignKey: "funcionario",
  as: "funcionarioDetails",
});

module.exports = Permisos;
