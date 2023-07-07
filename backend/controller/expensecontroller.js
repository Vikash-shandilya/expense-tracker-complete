const expense = require("../model/expense");
const user = require("../model/user");

exports.addexpense = (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  const newExpense = new expense({
    amount: amount,
    description: description,
    category: category,
    userId: req.user.id, // Assuming user ID is stored in req.user.id
  });

  newExpense
    .save()
    .then(async () => {
      console.log("start ");
      let userfound = await user.findOne({ where: { id: req.user.id } });
      console.log("first line");
      let previous_expenses = userfound.total_expenses;
      console.log(previous_expenses);
      console.log(typeof amount);
      if (previous_expenses === null) {
        previous_expenses = 0;
      }
      console.log("second line");
      userfound.total_expenses = previous_expenses + parseInt(amount);
      await userfound.save();
      console.log("final line ");

      res.status(200).json("Expense added");
    })
    .catch((error) => {
      // Handle error appropriately
      res.status(500).json("Failed to add expense");
    });
};

exports.deleted = (req, res, next) => {
  const productid = req.params.productid;
  expense
    .findByPk(productid)
    .then((prod) => {
      if (!prod) {
        return res.status(404).json({ message: "Expense not found" });
      }
      if (prod.userId !== req.user.id) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete the expense" });
      }
      console.log(prod);
      return prod.destroy();
    })
    .then(() => {
      console.log("deleted");
      res.json({ message: "Deleted successfully" });
    });
};

exports.index = (req, res, next) => {
  expense.findAll({ where: { userId: req.user.id } }).then((prod) => {
    res.json(prod);
  });
};
