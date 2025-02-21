const { Sequelize } = require("sequelize");

class Database {
  constructor() {
    this.sequelize = new Sequelize({
      dialect: "postgres",
      host: process.env.DB_HOSTNAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
  }

  connect() {
    return this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection has been established successfully.");
      })
      .catch((err) => {
        console.error("Unable to connect to the database:", err);
      });
  }

  getSequelize() {
    return this.sequelize;
  }
}

module.exports = Database;
