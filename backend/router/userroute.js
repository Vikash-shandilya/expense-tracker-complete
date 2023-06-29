const express = require("express");
const router = express.Router();

const usercontroller = require("../controller/usercontroller");
const user = require("../model/user");

router.post("/user/signup", usercontroller.submitform);

router.post("/user/login", usercontroller.login);

module.exports = router;
