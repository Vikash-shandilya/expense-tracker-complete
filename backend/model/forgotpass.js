const Sequelize = require("sequelize");
const sequelize = require("../database/databse");

const forgotpasstable = sequelize.define("forgotpass", {
  id: {
    type: Sequelize.DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  userId: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: false,
  },
  isActive: {
    type: Sequelize.BOOLEAN,
  },
});

module.exports = forgotpasstable;
