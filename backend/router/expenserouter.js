const express = require("express");
const router = express.Router();

const expensecontroller = require("../controller/expensecontroller");
const authtoken = require("../middleware/tokenauth");

router.post("/expense", authtoken.authtoken, expensecontroller.addexpense);
router.get(
  "/expenses/deleted/:productid",
  authtoken.authtoken,
  expensecontroller.deleted
);
router.post("/showexpense", authtoken.authtoken, expensecontroller.index);

module.exports = router;
