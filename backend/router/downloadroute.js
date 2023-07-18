const express = require("express");
const router = express.Router();

const downloadcontroller = require("../controller/downloadcontroller");

const authtoken = require("../middleware/tokenauth");

router.get("/download", authtoken.authtoken, downloadcontroller.getfile);
router.get(
  "/getpreviousdownloads",
  authtoken.authtoken,
  downloadcontroller.getpreviousdownloads
);
module.exports = router;
