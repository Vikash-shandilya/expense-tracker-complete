const sequelize = require("sequelize");

const expenses = new sequelize("expenses", "root", "localhost", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = expenses;
