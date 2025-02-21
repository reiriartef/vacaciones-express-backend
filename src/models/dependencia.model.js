const { DataTypes, Model } = require("sequelize");
const Database = require("../../config/db");
const db = new Database();

class Dependencia extends Model {}

Dependencia.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "Dependencia",
    tableName: "dependencia",
    timestamps: false,
  }
);

module.exports = Dependencia;
