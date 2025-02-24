const { DataTypes, Model } = require("sequelize");
const Database = require("../../config/db");
const db = new Database();
const TipoEmpleado = require("./tipoEmpleado.model");

class Cargo extends Model {}

Cargo.init(
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
    tipo_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: db.getSequelize(),
    modelName: "Cargo",
    tableName: "cargo",
    timestamps: false,
  }
);

Cargo.belongsTo(TipoEmpleado, {
  foreignKey: "tipo_empleado",
  targetKey: "id",
  as: "tipoEmpleado",
});

module.exports = Cargo;
