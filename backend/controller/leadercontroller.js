const expense = require("../model/expense");
const User = require("../model/user");

const sequelize = require("sequelize");

exports.showleaderboard = (req, res, next) => {
  expense
    .findAll({
      attributes: [
        "userId",
        [sequelize.fn("SUM", sequelize.col("amount")), "totalExpense"], // Calculate the sum of 'amount' column and alias it as 'totalExpense'
      ],
      group: ["userId"],
      include: [{ model: User, attributes: ["name"] }], // Include the User model and specify the attributes you want to fetch
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
