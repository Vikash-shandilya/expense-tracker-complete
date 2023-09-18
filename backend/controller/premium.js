const user = require("../model/user");
const expense = require("../model/expense");
const order = require("../model/order");
const { Sequelize } = require("sequelize");

exports.getexpensemonthly = async (req, res, next) => {
  const month = req.params.monthname;
  const result = await expense.findAll({
    where: {
      [Sequelize.Op.and]: [
        Sequelize.where(
          Sequelize.fn("MONTH", Sequelize.col("createdAt")),
          month
        ),
        { userId: req.user.id }, // Additional condition
      ],
    },
  });

  res.status(201).json(result);
};
