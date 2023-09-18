const express = require("express");
const router = express.Router();

const premiumcontroller = require("../controller/premium");
const authtoken = require("../middleware/tokenauth");

router.get(
  "/monthlyexpense/:monthname",
  authtoken.authtoken,
  premiumcontroller.getexpensemonthly
);

module.exports = router;
