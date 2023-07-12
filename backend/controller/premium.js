const user = require("../model/user");
const expense = require("../model/expense");
const order = require("../model/order");
const { Sequelize } = require("sequelize");

exports.getexpensemonthly = async (req, res, next) => {
  const month = req.params;
  const res = await expense.findAll(
    where(Sequelize.fn("MONTH", Sequelize.col("createdAt")), month)
  );
  res.status(201).json(res);
};
exports.getexpenseweekly = async (req, res, next) => {
  const userid = req.user.id;
  const username = await expense.findOne({ where: { userId: req.user.id } });
  const currentdate = username.createdAt;
  const week = req.params;
  const res = await expense.findAll(where(Sequelize.fn("")));
};
