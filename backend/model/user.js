const Sequelize = require("sequelize");
const sequelize = require("../database/databse");

const user = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
  },
  email: {
    type: Sequelize.STRING,
  },
  phone_number: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
  ispremium: {
    type: Sequelize.BOOLEAN,
  },
  total_expenses: {
    type: Sequelize.INTEGER,
  },
});

module.exports = user;
