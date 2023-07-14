const sequelize = require("../path/to/sequelize"); // Import Sequelize instance

exports.addexpense = (req, res, next) => {
  const amount = req.body.amount;
  const description = req.body.description;
  const category = req.body.category;

  sequelize.transaction(async (t) => {
    try {
      const newExpense = await expense.create(
        {
          amount: amount,
          description: description,
          category: category,
          userId: req.user.id, // Assuming user ID is stored in req.user.id
        },
        { transaction: t } // Associate the transaction with the create operation
      );

      let userfound = await user.findOne({
        where: { id: req.user.id },
        transaction: t, // Associate the transaction with the find operation
      });

      let previous_expenses = userfound.total_expenses || 0;
      userfound.total_expenses = previous_expenses + parseInt(amount);
      await userfound.save({ transaction: t }); // Associate the transaction with the save operation

      res.status(200).json("Expense added");
    } catch (error) {
      // Rollback the transaction if an error occurs
      await t.rollback();
      console.error(error);
      res.status(500).json("Failed to add expense");
    }
  });
};
