const express = require("express");
const router = express.Router();

const usercontroller = require("../controller/usercontroller");
const user = require("../model/user");

router.post("/user/signup", usercontroller.submitform);

router.post("/user/login", usercontroller.login);

router.post("/user/forgotpass", usercontroller.passwordreset);

router.post("/password/reset/:token", usercontroller.passwordresetfinal);

module.exports = router;
