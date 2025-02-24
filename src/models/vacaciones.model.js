const { DataTypes, Model } = require("sequelize");
const Database = require("../../config/db");
const db = new Database();

class Vacaciones extends Model {}

Vacaciones.init(
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
    fecha_salida: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fecha_reincorporacion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    año: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dias_disfrutar: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    estatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "SOLICITADA",
    },
    aprobado_por: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha_finalizacion: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "Vacaciones",
    tableName: "vacaciones",
    timestamps: false,
  }
);

module.exports = Vacaciones;
