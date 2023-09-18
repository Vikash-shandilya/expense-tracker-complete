const express = require("express");
const router = express.Router();

const ordercontroller = require("../controller/payment");
const authtoken = require("../middleware/tokenauth");

router.get(
  "/get_order_details",
  authtoken.authtoken,
  ordercontroller.getOrderDetails
);
router.post("/updateorder", authtoken.authtoken, ordercontroller.updateorder);
router.post(
  "/paymentfailed",
  authtoken.authtoken,
  ordercontroller.paymentfailed
);

router.get("/ifpremium", authtoken.authtoken, ordercontroller.ifpremium);

module.exports = router;
