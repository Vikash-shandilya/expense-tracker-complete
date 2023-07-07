const expense = require("../model/expense");
const user = require("../model/user");
const sequelize = require("../database/databse");

exports.addexpense = (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  sequelize
    .transaction(async (t) => {
      try {
        const newExpense = await expense.create(
          {
            amount: amount,
            description: description,
            category: category,
            userId: req.user.id, // Assuming user ID is stored in req.user.id
          },
          { transaction: t }
        );

        await newExpense.save();

        let userfound = await user.findOne(
          { where: { id: req.user.id } },
          { transaction: t }
        );
        console.log("first line");
        let previous_expenses = userfound.total_expenses;

        if (previous_expenses === null) {
          previous_expenses = 0;
        }

        userfound.total_expenses = previous_expenses + parseInt(amount);
        await userfound.save({ transaction: t });

        res.status(200).json("Expense added");
      } catch (error) {
        await t.rollback();
        // Handle error appropriately
        console.error(error);
        res.status(500).json("Failed to add expense");
      }
    })
    .catch((error) => {
      // Handle error appropriately
      console.error(error);
      res.status(500).json("Failed to add expense");
    });
};

exports.deleted = async (req, res, next) => {
  const productid = req.params.productid;

  try {
    const deleteditem = await expense.findByPk(productid);
    console.log(deleteditem);

    if (!deleteditem) {
      return res.status(404).json({ message: "Expense not found" });
    }
    if (deleteditem.userId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete the expense" });
    }

    const transaction = await sequelize.transaction();

    try {
      await deleteditem.destroy({ transaction });

      const userexpense = await user.findOne(
        { where: { id: req.user.id } },
        { transaction }
      );
      userexpense.total_expenses -= deleteditem.amount;
      await userexpense.save({ transaction });

      await transaction.commit();

      res.status(200).json({ message: "Expense deleted" });
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      res.status(500).json({ message: "Failed to delete expense" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to find expense" });
  }
};

exports.index = (req, res, next) => {
  expense
    .findAll(
      { where: { userId: req.user.id } },
      (attributes = ["id", "amount", "description", "category"])
    )
    .then((prod) => {
      res.json(prod);
    });
};
