const express = require("express");
const router = express.Router();

const expensecontroller = require("../controller/expensecontroller");

router.post("/expense", expensecontroller.addexpense);
router.get("/expenses/deleted/:productid", expensecontroller.deleted);
router.get("/expense", expensecontroller.index);

module.exports = router;
