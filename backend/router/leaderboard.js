const express = require("express");
const router = express.Router();

const leadercontroller = require("../controller/leadercontroller");

router.get("/showleaderboard", leadercontroller.showleaderboard);

module.exports = router;
