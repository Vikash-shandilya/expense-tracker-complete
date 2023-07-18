const Sequelize = require("sequelize");
const sequelize = require("../database/databse");

const download = sequelize.define("download", {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  filename: {
    type: Sequelize.STRING,
  },
  fileurl: {
    type: Sequelize.STRING,
  },
});

module.exports = download;
