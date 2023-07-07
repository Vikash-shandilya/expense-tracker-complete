const expense = require("../model/expense");
const User = require("../model/user");

const sequelize = require("sequelize");

exports.showleaderboard = (req, res, next) => {
  User.findAll({
    attributes: ["name", "total_expenses"],
    order: [["total_expenses", "DESC"]],
  })
    .then((expenses) => {
      // expenses will contain an array of objects with 'userId' and 'totalExpense' properties
      res.json(expenses);
    })
    .catch((error) => {
      // Handle the error appropriately
      res
        .status(500)
        .json({ error: "An error occurred while fetching expenses." });
    });
};
