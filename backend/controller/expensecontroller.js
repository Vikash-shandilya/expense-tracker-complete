const expense = require("../model/expense");

exports.addexpense = (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;
  expense
    .create({ amount: amount, description: description, category: category })
    .then((prod) => {
      res.status(200).json("expenses added ");
    });
};

exports.deleted = (req, res, next) => {
  const productid = req.params.productid;
  expense
    .findByPk(productid)
    .then((prod) => {
      console.log(prod);
      return prod.destroy();
    })
    .then(() => {
      console.log("deleted");
      res.json({ message: "Deleted successfully" });
    });
};

exports.index = (req, res, next) => {
  expense.findAll().then((prod) => {
    res.json(prod);
  });
};
