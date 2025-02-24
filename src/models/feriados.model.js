const { DataTypes, Model } = require("sequelize");
const Database = require("../../config/db");
const db = new Database();

class Feriados extends Model {}

Feriados.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "Feriados",
    tableName: "feriados",
    timestamps: false,
  }
);

module.exports = Feriados;
