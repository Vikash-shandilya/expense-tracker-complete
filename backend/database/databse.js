const sequelize = require("sequelize");

const environment = "development";
const config = JSON.parse(process.env.CONFIG);

const expenses = new sequelize(
  config[environment].schema_name,
  config[environment].database_username,
  config[environment].database_password,
  {
    dialect: "mysql",
    host: "database-1.chizv1y3xg8w.eu-north-1.rds.amazonaws.com",
  }
);

module.exports = expenses;

