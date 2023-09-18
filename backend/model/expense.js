const Sequelize = require("sequelize");
const sequelize = require("../database/databse");

const expense = sequelize.define("expense", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  amount: {
    type: Sequelize.INTEGER,
  },
  description: {
    type: Sequelize.STRING,
  },
  category: {
    type: Sequelize.ENUM("petrol", "food", "rent", "other"),
  },
});

module.exports = expense;
