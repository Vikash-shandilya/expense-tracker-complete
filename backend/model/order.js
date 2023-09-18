const Sequelize = require("sequelize");
const sequelize = require("../database/databse");

const order = sequelize.define("order", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  paymentid: {
    type: Sequelize.STRING,
  },
  orderid: {
    type: Sequelize.STRING,
  },
  status: {
    type: Sequelize.STRING,
  },
});

module.exports = order;
