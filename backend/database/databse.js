const Sequelize = require("sequelize");
const environment = "development"; // Change based on your environment
const config = JSON.parse(process.env.CONFIG);

const expenses = new Sequelize(
  config[environment].schema_name,
  config[environment].database_username,
  config[environment].database_password,
  {
    dialect: "mysql",
    host: "localhost",
    // You can add more options here if needed
  }
);

module.exports = expenses;
