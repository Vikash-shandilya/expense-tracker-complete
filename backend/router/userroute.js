const express = require("express");
const router = express.Router();

const usercontroller = require("../controller/usercontroller");
const user = require("../model/user");

router.post("/user/signup", usercontroller.submitform);

module.exports = router;
