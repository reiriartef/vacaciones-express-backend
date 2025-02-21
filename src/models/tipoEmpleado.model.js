const { DataTypes, Model } = require("sequelize");
const Database = require("../../config/db");
const db = new Database();

class TipoEmpleado extends Model {}

TipoEmpleado.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "tipoEmpleado",
    tableName: "tipo_empleado",
    timestamps: false,
  }
);

module.exports = TipoEmpleado;
