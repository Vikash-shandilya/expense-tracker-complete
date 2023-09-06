const sequelize = require("sequelize");

const environment = "development";
const config = JSON.parse(process.env.CONFIG);

const expenses = new sequelize(
  config[environment].schema_name,
  config[environment].database_username,
  config[environment].database_password,
  {
    dialect: "mysql",
    host: "localhost",
  }
);

module.exports = expenses;
